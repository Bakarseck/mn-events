"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface EditableCellProps {
  value: string
  onChange: (value: string) => void
}

export default function EditableCell({ value, onChange }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mettre à jour la valeur d'édition lorsque la valeur change
  useEffect(() => {
    setEditValue(value)
  }, [value])

  // Focus sur l'input lorsqu'on passe en mode édition
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    onChange(editValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
      onChange(editValue)
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setEditValue(value) // Annuler les modifications
    }
  }

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="w-full bg-white dark:bg-gray-700 border border-green-200 dark:border-green-900 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
      autoComplete="off"
    />
  ) : (
    <div
      onDoubleClick={handleDoubleClick}
      className="min-h-[1.5rem] cursor-text hover:bg-green-50 dark:hover:bg-gray-700 px-1 py-0.5 rounded transition-colors"
      title="Double-cliquez pour modifier"
    >
      {value || <span className="text-gray-400 dark:text-gray-500 italic">Cliquez pour éditer</span>}
    </div>
  )
}
