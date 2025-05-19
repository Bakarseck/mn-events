"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { SunIcon, MoonIcon } from "lucide-react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Effet pour définir mounted à true après le montage du composant
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Si le composant n'est pas monté, afficher un bouton de chargement
  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="rounded-full bg-transparent border-0 hover:bg-green-50">
        <span className="h-5 w-5 opacity-50"></span>
        <span className="sr-only">Chargement du thème</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full bg-transparent border-0 hover:bg-green-50 dark:hover:bg-gray-800"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <SunIcon className="h-5 w-5 text-yellow-400" />
      ) : (
        <MoonIcon className="h-5 w-5 text-green-800 dark:text-white" />
      )}
      <span className="sr-only">Changer de thème</span>
    </Button>
  )
}
