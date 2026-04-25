import mongoose from "mongoose";

const RoommateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Roommate || mongoose.model("Roommate", RoommateSchema);