"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Dashboard() {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showRoommateForm, setShowRoommateForm] = useState(false);
    const [roommateName, setRoommateName] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [roommates, setRoommates] = useState([]);
    const [paidBy, setPaidBy] = useState("");
    const [editingExpense, setEditingExpense] = useState(null);
    const [currentUser, setCurrentUser] = useState("");

    const [form, setForm] = useState({
        title: "",
        amount: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;
        setLoading(true);

        if (!paidBy) {
            toast.warning("Select who paid ❌");
            setLoading(false);
            return;
        }

        try {
            let res;

            // ✅ EDIT MODE
            if (editingExpense) {
                res = await fetch(`/api/expenses/update/${editingExpense._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: form.title,
                        amount: Number(form.amount),
                        paidBy,
                    }),
                });
            }
            // ✅ ADD MODE
            else {
                res = await fetch("/api/expenses/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: form.title,
                        amount: Number(form.amount),
                        paidBy,
                    }),
                });
            }

            const data = await res.json();

            if (data.message) {
                toast.warning(editingExpense ? "Updated ✏️" : "Added 💸");

                setForm({ title: "", amount: "" });
                setPaidBy("");
                setShowForm(false);
                setEditingExpense(null); // 🔥 VERY IMPORTANT
                fetchExpenses();
            } else {
                toast.error(data.error);
            }

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong ❌");
        }

        setLoading(false);
    };


    useEffect(() => {
        fetchExpenses();
        fetchRoommates();
        fetchUser();
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await fetch("/api/expenses/get");
            const data = await res.json();

            setExpenses([...new Map(
                (data.expenses || []).map(item => [item._id, item])
            ).values()]);
        } catch (error) {
            console.error(error);
        }
    };
    const totalExpenses = expenses.reduce(
        (sum, exp) => sum + exp.amount,
        0
    );

    const handleAddRoommate = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/roommates/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: roommateName }),
            });

            const data = await res.json();

            if (data.message) {
                toast.success("Roommate added 👤");

                setRoommateName("");
                setShowRoommateForm(false);
                fetchRoommates();
            } else {
                toast.error(data.error);
            }

        } catch (error) {
            console.error(error);
        }
    };

    const fetchRoommates = async () => {
        const res = await fetch("/api/roommates/get");
        const data = await res.json();

        setRoommates(data.roommates || []);
    };

    const calculateBalances = () => {
        const balances = {};


        // 👇 include YOU manually
        const allPeople = ["You", ...roommates.map(r => r.name)];

        // initialize
        allPeople.forEach((name) => {
            balances[name] = 0;
        });

        expenses.forEach((exp) => {
            const split = exp.splitAmount;

            allPeople.forEach((name) => {
                if (name === exp.paidBy) {
                    balances[name] += exp.amount - split;
                } else {
                    balances[name] -= split;
                }
            });
        });

        return balances;
    };
    const balances = calculateBalances();
    const youOwe =
        balances["You"] < 0 ? Math.abs(balances["You"]) : 0;

    const youAreOwed =
        balances["You"] > 0 ? balances["You"] : 0;
    const currentUserName = "You";

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/expenses/delete/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.message) {
                fetchExpenses(); // refresh list
            } else {
                toast.error("Delete failed ❌");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteRoommate = async (id) => {
        try {
            const res = await fetch(`/api/roommates/delete/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Roommate deleted 🗑️");

                // ✅ instant UI update (no refetch needed)
                setRoommates((prev) => prev.filter((rm) => rm._id !== id));
            } else {
                toast.error("Delete failed ❌");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (exp) => {
        setEditingExpense(exp);

        setForm({
            title: exp.title,
            amount: exp.amount,
        });

        setPaidBy(exp.paidBy);
        setShowForm(true);
    };

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/user/me");
            const data = await res.json();

            if (data.name) {
                setCurrentUser(data.name);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (

        <div className="min-h-screen space-y-8 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 md:p-12 text-white">
            <Navbar currentPage="dashboard" />
            <motion.div
                initial={{ x: -100, opacity: 0 }}   // 👈 comes from left
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 text-white"
            >

                <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

                {/* ACTION BUTTONS */}
                <div className="flex gap-4 mb-6">

                    <GlassButton
                        variant="primary" glow
                        onClick={() => setShowRoommateForm(!showRoommateForm)}
                    >
                        + Add Roommate
                    </GlassButton>

                    <GlassButton
                        variant="outline"
                        onClick={() => setShowForm(!showForm)}
                    >
                        + Add Expense
                    </GlassButton>

                </div>


                {/* ADD ROOMMATE FORM */}
                {showRoommateForm && (
                    <GlassCard className="p-4 mb-6">
                        <form
                            onSubmit={handleAddRoommate}
                            className="flex gap-3 items-center"
                        >
                            <input
                                placeholder="Roommate name"
                                value={roommateName}
                                onChange={(e) => setRoommateName(e.target.value)}
                                className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            <GlassButton type="submit" variant="primary">
                                Add
                            </GlassButton>
                        </form>
                    </GlassCard>
                )}


                {/* ADD EXPENSE FORM */}
                {showForm && (
                    <GlassCard className="p-6 mb-6">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >

                            <select
                                value={paidBy}
                                onChange={(e) => setPaidBy(e.target.value)}
                                className="
    bg-white/10 
    backdrop-blur-xl 
    border border-white/20 
    text-white 
    p-3 
    rounded-xl 
    outline-none 
    focus:ring-2 focus:ring-cyan-400
    appearance-none
  "
                            >
                                <option value="" className="bg-zinc-900 text-white">
                                    Select who paid
                                </option>

                                <option value="You" className="bg-zinc-900 text-white">
                                    You
                                </option>

                                {roommates.map((rm) => (
                                    <option
                                        key={rm._id}
                                        value={rm.name}
                                        className="bg-zinc-900 text-white"
                                    >
                                        {rm.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                placeholder="Title"
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                                className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-white placeholder-white/50 focus:outline-none"
                            />

                            <input
                                placeholder="Amount"
                                type="number"
                                value={form.amount}
                                onChange={(e) =>
                                    setForm({ ...form, amount: e.target.value })
                                }
                                className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-white focus:outline-none"
                            />

                            <GlassButton type="submit" variant="primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    "Add"
                                )}
                            </GlassButton>

                        </form>
                    </GlassCard>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <GlassCard className="p-6">
                        <h2 className="text-lg font-semibold">Total Expenses</h2>
                        <p className="text-2xl mt-2">₹{totalExpenses}</p>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h2 className="text-lg font-semibold">You Owe</h2>
                        <p className="text-2xl mt-2 text-rose-400">₹{youOwe}</p>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h2 className="text-lg font-semibold">You Are Owed</h2>
                        <p className="text-2xl mt-2 text-emerald-400">₹{youAreOwed}</p>
                    </GlassCard>

                </div>
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>

                    {expenses.length === 0 ? (
                        <p>No expenses yet</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {expenses.map((exp) => (
                                <GlassCard
                                    key={exp._id}
                                    className="p-5 flex flex-row justify-between items-start w-full"
                                >
                                    {/* LEFT */}
                                    <div className="flex flex-col">
                                        <p className="text-lg font-semibold">{exp.title}</p>
                                        <p className="text-sm text-white/70">
                                            Paid by {exp.paidBy}
                                        </p>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-xl font-bold">
                                            ₹{exp.amount}
                                        </span>

                                        <div className="flex gap-2">
                                            <GlassButton
                                                variant="primary"
                                                onClick={() => handleEdit(exp)}
                                            >
                                                Edit
                                            </GlassButton>

                                            <GlassButton
                                                variant="destructive"
                                                onClick={() => handleDelete(exp._id)}
                                            >
                                                Delete
                                            </GlassButton>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">Roommates</h2>

                    {roommates.length === 0 ? (
                        <p>No roommates yet</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {roommates.map((rm) => (
                                <GlassCard
                                    key={rm._id}
                                    className="p-4 flex justify-between items-center"
                                >
                                    <span>{rm.name}</span>

                                    <GlassButton
                                        variant="destructive"
                                        onClick={() => handleDeleteRoommate(rm._id)}
                                    >
                                        Delete
                                    </GlassButton>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">Balances</h2>

                    {Object.keys(balances).length === 0 ? (
                        <p>No data</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {Object.entries(balances).map(([name, amount]) => (
                                <GlassCard
                                    key={name}
                                    className="p-4 flex justify-between items-center transition hover:scale-[1.02]"
                                >
                                    <span className="font-medium text-lg">{name}</span>

                                    <span
                                        className={`text-lg font-semibold ${amount > 0 ? "text-emerald-400" : "text-rose-400"
                                            }`}
                                    >
                                        {amount > 0
                                            ? `+₹${amount}`
                                            : `-₹${Math.abs(amount)}`}
                                    </span>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}