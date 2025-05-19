"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function DatePickerWithCalendar() {
  const [date, setDate] = useState<Date>(new Date())
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Effet pour définir mounted à true après le montage du composant
  useEffect(() => {
    setMounted(true)
  }, [])

  // Format the date in French with capitalized first letter
  const formattedDate = format(date, "EEEE dd/MM/yy", { locale: fr })
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  if (!mounted) {
    return (
      <Button variant="outline" className="flex items-center gap-2 text-green-800 font-medium border-0 bg-transparent">
        <span className="opacity-0">Chargement...</span>
      </Button>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-green-800 dark:text-green-400 font-medium border-0 bg-transparent hover:bg-green-50 dark:hover:bg-gray-800"
        >
          {capitalizedDate}
          <CalendarIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-green-800/20" align="end">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              setDate(newDate)
              setIsOpen(false)
            }
          }}
          initialFocus
          locale={fr}
          className="dark:bg-gray-800"
        />
      </PopoverContent>
    </Popover>
  )
}
