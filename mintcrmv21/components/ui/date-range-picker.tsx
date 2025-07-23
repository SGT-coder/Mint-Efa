"use client"
import { Calendar } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarPrimitive } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DatePickerWithRange({
  date,
  setDate,
}: {
  date: { from: Date | null; to: Date | null }
  setDate: (date: { from: Date | null; to: Date | null }) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-[280px] justify-start text-left font-normal", !date?.from && "text-muted-foreground")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              `${date.from?.toLocaleDateString()} - ${date.to?.toLocaleDateString()}`
            ) : (
              date.from?.toLocaleDateString()
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <CalendarPrimitive
          mode="range"
          defaultMonth={date?.from ? date.from : new Date()}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          pagedNavigation
        />
      </PopoverContent>
    </Popover>
  )
}
