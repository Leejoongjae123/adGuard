"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 select-none", className)}
      classNames={{
        root: "w-fit",
        months: "flex flex-col gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center items-center relative h-7",
        caption_label: "text-sm font-semibold",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between px-1",
        button_previous: cn(
          "h-7 w-7 inline-flex items-center justify-center rounded-md border border-input",
          "opacity-60 hover:opacity-100 hover:border-slate-300 transition-[border-color,opacity] duration-150 outline-none"
        ),
        button_next: cn(
          "h-7 w-7 inline-flex items-center justify-center rounded-md border border-input",
          "opacity-60 hover:opacity-100 hover:border-slate-300 transition-[border-color,opacity] duration-150 outline-none"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex mb-1",
        weekday: "w-8 h-8 flex items-center justify-center text-[0.75rem] font-normal text-muted-foreground",
        weeks: "flex flex-col gap-1",
        week: "flex",
        day: cn(
          "relative p-0 text-center",
          "[&:has([aria-selected])]:rounded-md [&:has([aria-selected])]:bg-accent",
        ),
        day_button: cn(
          "h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-normal",
          "outline-none transition-colors duration-100",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:ring-2 focus-visible:ring-primary/30"
        ),
        selected:
          "!bg-primary !text-primary-foreground hover:!bg-primary hover:!text-primary-foreground rounded-md",
        today: "bg-accent text-accent-foreground font-semibold",
        outside: "text-muted-foreground opacity-40",
        disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
        range_start: "rounded-l-md",
        range_end: "rounded-r-md",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
