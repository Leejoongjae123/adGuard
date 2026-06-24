"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarDays } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "./calendar"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

function DatePicker({ value, onChange, placeholder = "날짜 선택", className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-lg border border-input bg-transparent px-3 text-sm whitespace-nowrap",
          "transition-[border-color] duration-150 outline-none select-none",
          "hover:border-slate-300 focus-visible:border-primary",
          !value && "text-muted-foreground",
          className
        )}
      >
        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span>{value ? format(value, "yyyy-MM-dd") : placeholder}</span>
      </button>

      {open && (
        <div
          className={cn(
            "absolute left-0 top-full z-50 mt-1.5 rounded-xl border bg-white",
            "shadow-lg ring-1 ring-black/[0.06]",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-100"
          )}
          style={{ borderColor: "var(--color-border)" }}
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange?.(date)
              setOpen(false)
            }}
            defaultMonth={value}
          />
        </div>
      )}
    </div>
  )
}

export { DatePicker }
