"use client"

import * as React from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  cleaners,
  startDate,
  getColorForPerson,
  ...dayPickerProps
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <div className="relative">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-4 bg-transparent", className)}
        classNames={{
          ...defaultClassNames,
          // 🛠️ Ensure the table doesn't collapse into a single column
          months: "flex flex-col",
          month: "space-y-4",
          month_grid: "w-full border-collapse space-y-1",
          table: "w-full border-separate border-spacing-y-2",

          // Row of weekdays
          weekdays: "flex justify-between",
          weekday: "text-white/40 w-10 font-normal text-[0.8rem] text-center",

          // Actual week rows
          week: "flex w-full justify-between mt-2",

          // Individual cell container
          day: "relative p-0 text-center text-sm flex items-center justify-center w-10 h-10",

          outside: "hidden", // Removes dates from other months
          ...classNames,
        }}
        components={{
          Chevron: ({ orientation }) => (
            orientation === "left" ? <ChevronLeftIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />
          ),
          // Kill borders on structural table elements
          Row: (props) => <tr {...props} className="flex w-full justify-between" style={{ border: 'none', background: 'none' }} />,
          Head: (props) => <thead {...props} style={{ border: 'none' }} />,
          DayButton: (dayProps) => (
            <CalendarDayButton
              {...dayProps}
              cleaners={cleaners}
              startDate={startDate}
              getColorForPerson={getColorForPerson}
            />
          ),
        }}
        {...dayPickerProps}
      />
    </div>
  );
}

function CalendarDayButton({ className, day, modifiers, ...props }) {
  const {
    cleaners = [],
    startDate,
    getColorForPerson,
    ...buttonProps   // ✅ THIS LINE IS IMPORTANT
  } = props;
  const today = new Date();
  const isToday = day.date.toDateString() === new Date().toDateString();
  const isSelected = props["aria-selected"] === true;
  let bgColor = "transparent";

  if (cleaners.length && startDate) {
    const diffTime = day.date - new Date(startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const index =
      ((diffDays % cleaners.length) + cleaners.length) % cleaners.length;

    const person = cleaners[index];
    bgColor = getColorForPerson ? getColorForPerson(person) : "transparent";
  }
  // INLINE STYLES to beat the global '*' selector
  const circleStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px', // Slightly smaller to ensure fit
    height: '38px',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    // Universal border killer + specific ring
    border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: isSelected ? '#ffffff' : (isToday ? 'rgba(255, 255, 255, 0.15)' : bgColor),
    color: isSelected ? '#000000' : '#ffffff',
    outline: 'none',
    boxShadow: isToday && !isSelected ? '0 0 12px rgba(255, 255, 255, 0.6)' : 'none',
    fontSize: '0.875rem',
  };

  return (
    <button
      {...buttonProps}   // ✅ ONLY SAFE PROPS GO HERE
      style={circleStyle}
      className="hover:scale-105 active:scale-95"
    >
      {day.date.getDate()}
    </button>
  );
}

export { Calendar }