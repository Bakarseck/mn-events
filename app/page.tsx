"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { PlayIcon, PauseIcon, SaveIcon, PlusIcon, DownloadIcon, UploadIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Timer from "@/components/timer"
import DatePickerWithCalendar from "@/components/date-picker-with-calendar"
import RecordingIndicator from "@/components/recording-indicator"
import ThemeToggle from "@/components/theme-toggle"
import EditableCell from "@/components/editable-cell"

// Types pour les données
type Khassida = {
  id: number
  name: string
  reference: string
  duration: string
  seconds: number // Ajout du nombre de secondes pour le tracking interne
}

type Kourel = {
  id: number
  name: string
  khassidas: Khassida[]
}

// Données initiales
const initialKourels: Kourel[] = [
  {
    id: 1,
    name: "kurel 1 mn",
    khassidas: [
      { id: 1, name: "jazbu", reference: "darouuu", duration: "00:00", seconds: 0 },
      { id: 2, name: "mawahiboul", reference: "71", duration: "12:21", seconds: 741 },
      { id: 3, name: "DAROU", reference: "RRRR", duration: "11:49", seconds: 709 },
      { id: 4, name: "MAt", reference: "visuel", duration: "05:46", seconds: 346 },
      { id: 5, name: "Bamba", reference: "Niang", duration: "00:10", seconds: 10 },
    ],
  },
]

export default function Dashboard() {
  // État pour suivre l'index de la ligne en cours d'enregistrement (-1 signifie aucun enregistrement)
  const [recordingIndex, setRecordingIndex] = useState<number>(-1)
  // État pour suivre si le timer est en cours d'exécution
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)
  // État pour stocker les données des kourels
  const [kourels, setKourels] = useState<Kourel[]>(initialKourels)
  // État pour suivre le kourel actif (pour l'enregistrement)
  const [activeKourelIndex, setActiveKourelIndex] = useState<number>(0)
  // Compteur pour générer des IDs uniques
  const nextIdRef = useRef(100)
  // Timer actuel en secondes
  const [currentSeconds, setCurrentSeconds] = useState(0)
  // Référence pour l'input file
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fonction pour mettre à jour la durée de la ligne en cours d'enregistrement
  const updateDuration = (seconds: number) => {
    if (isTimerRunning && activeKourelIndex >= 0 && recordingIndex >= 0) {
      setCurrentSeconds(seconds)

      setKourels((prevKourels) => {
        // Vérifier si les indices sont valides
        if (!prevKourels[activeKourelIndex] || !prevKourels[activeKourelIndex].khassidas[recordingIndex]) {
          return prevKourels
        }

        // Créer une copie profonde pour éviter les mutations directes
        const updatedKourels = JSON.parse(JSON.stringify(prevKourels))

        const khassida = updatedKourels[activeKourelIndex].khassidas[recordingIndex]
        khassida.seconds = seconds

        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        khassida.duration = `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`

        return updatedKourels
      })
    } else {
      // Si aucun enregistrement n'est en cours, mettre à jour uniquement currentSeconds
      setCurrentSeconds(seconds)
    }
  }

  // Fonction pour démarrer/arrêter l'enregistrement
  const toggleRecording = () => {
    if (isTimerRunning) {
      // Arrêter l'enregistrement
      setIsTimerRunning(false)
      setRecordingIndex(-1)
    } else if (kourels.length > 0 && kourels[activeKourelIndex].khassidas.length > 0) {
      // Démarrer l'enregistrement sur la première ligne si aucune n'est sélectionnée
      setIsTimerRunning(true)
      setRecordingIndex(0)

      // Réinitialiser le timer si on démarre un nouvel enregistrement
      if (recordingIndex === -1) {
        setCurrentSeconds(0)
      } else {
        // Sinon, reprendre à partir de la durée actuelle de la ligne
        setCurrentSeconds(kourels[activeKourelIndex].khassidas[recordingIndex].seconds)
      }
    }
  }

  // Fonction pour sélectionner une ligne à enregistrer
  const selectRowForRecording = (kourelIndex: number, khassidaIndex: number) => {
    if (isTimerRunning) {
      setActiveKourelIndex(kourelIndex)
      setRecordingIndex(khassidaIndex)

      // Mettre à jour le timer avec la durée de la nouvelle ligne sélectionnée
      setCurrentSeconds(kourels[kourelIndex].khassidas[khassidaIndex].seconds)
    }
  }

  // Fonction pour vider le tableau
  const cleanTable = () => {
    setKourels([])
    setIsTimerRunning(false)
    setRecordingIndex(-1)
    setActiveKourelIndex(0)
    setCurrentSeconds(0)
  }

  // Fonction pour ajouter un service
  const addService = () => {
    // Arrêter l'enregistrement en cours s'il y en a un
    if (isTimerRunning) {
      setIsTimerRunning(false)
    }

    if (kourels.length === 0) {
      // Si le tableau est vide, ajouter un nouveau kourel avec une première ligne
      const newKourel: Kourel = {
        id: nextIdRef.current++,
        name: "Nouveau Kourel",
        khassidas: [
          {
            id: nextIdRef.current++,
            name: "Nouveau Khassida",
            reference: "",
            duration: "00:00",
            seconds: 0,
          },
        ],
      }
      setKourels([newKourel])
      setActiveKourelIndex(0)
      setRecordingIndex(0)
    } else {
      // Sinon, ajouter une nouvelle ligne au kourel actif
      setKourels((prevKourels) => {
        const updatedKourels = JSON.parse(JSON.stringify(prevKourels))
        const newIndex = updatedKourels[activeKourelIndex].khassidas.length
        updatedKourels[activeKourelIndex].khassidas.push({
          id: nextIdRef.current++,
          name: "Nouveau Khassida",
          reference: "",
          duration: "00:00",
          seconds: 0,
        })
        return updatedKourels
      })

      // Mettre à jour l'index d'enregistrement après la mise à jour de l'état
      setTimeout(() => {
        setRecordingIndex(kourels[activeKourelIndex].khassidas.length)
      }, 0)
    }

    // Réinitialiser le timer et démarrer l'enregistrement sur la nouvelle ligne
    setCurrentSeconds(0)
    setIsTimerRunning(true)
  }

  // Fonction pour supprimer une ligne
  const deleteRow = (kourelIndex: number, khassidaIndex: number, event: React.MouseEvent) => {
    // Empêcher la propagation de l'événement pour éviter de sélectionner la ligne
    event.stopPropagation()

    // Si c'est la ligne en cours d'enregistrement, arrêter l'enregistrement
    if (isTimerRunning && activeKourelIndex === kourelIndex && recordingIndex === khassidaIndex) {
      setIsTimerRunning(false)
      setRecordingIndex(-1)
    }

    setKourels((prevKourels) => {
      // Créer une copie profonde pour éviter les mutations directes
      const updatedKourels = JSON.parse(JSON.stringify(prevKourels))

      // Supprimer la ligne
      updatedKourels[kourelIndex].khassidas.splice(khassidaIndex, 1)

      // Si c'était la dernière ligne du kourel, supprimer le kourel
      if (updatedKourels[kourelIndex].khassidas.length === 0) {
        updatedKourels.splice(kourelIndex, 1)

        // Si c'était le dernier kourel, retourner un tableau vide
        if (updatedKourels.length === 0) {
          return []
        }

        // Mettre à jour l'index du kourel actif si nécessaire
        if (activeKourelIndex >= updatedKourels.length) {
          setActiveKourelIndex(updatedKourels.length - 1)
        }
      } else {
        // Mettre à jour l'index d'enregistrement si nécessaire
        if (recordingIndex >= updatedKourels[kourelIndex].khassidas.length) {
          setRecordingIndex(updatedKourels[kourelIndex].khassidas.length - 1)
        }
      }

      return updatedKourels
    })
  }

  // Fonction pour mettre à jour une cellule
  const updateCell = (kourelIndex: number, khassidaIndex: number, field: keyof Khassida, value: string) => {
    setKourels((prevKourels) => {
      const updatedKourels = JSON.parse(JSON.stringify(prevKourels))
      updatedKourels[kourelIndex].khassidas[khassidaIndex][field] = value
      return updatedKourels
    })
  }

  // Fonction pour mettre à jour le nom du kourel
  const updateKourelName = (kourelIndex: number, value: string) => {
    setKourels((prevKourels) => {
      const updatedKourels = JSON.parse(JSON.stringify(prevKourels))
      updatedKourels[kourelIndex].name = value
      return updatedKourels
    })
  }

  // Fonction pour exporter les données en CSV
  const exportToCSV = () => {
    if (kourels.length === 0) return

    // Créer les en-têtes
    let csvContent = "Kourel,Khassida,Reference,Duree\n"

    // Ajouter les données
    kourels.forEach((kourel) => {
      kourel.khassidas.forEach((khassida, index) => {
        const kourelName = index === 0 ? kourel.name : "" // Afficher le nom du kourel uniquement sur la première ligne
        csvContent += `"${kourelName}","${khassida.name}","${khassida.reference}","${khassida.duration}"\n`
      })
    })

    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `mn_events_export_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Fonction pour déclencher l'upload de CSV
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Fonction pour traiter le fichier CSV uploadé
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (!content) return

      // Parser le CSV
      const lines = content.split("\n")
      if (lines.length < 2) return // Au moins l'en-tête et une ligne de données

      // Ignorer la première ligne (en-têtes)
      const dataLines = lines.slice(1).filter((line) => line.trim() !== "")

      // Créer un nouvel objet kourel
      const newKourel: Kourel = {
        id: nextIdRef.current++,
        name: "",
        khassidas: [],
      }

      // Parcourir les lignes de données
      dataLines.forEach((line, index) => {
        // Gérer les virgules dans les champs entre guillemets
        const values: string[] = []
        let currentValue = ""
        let insideQuotes = false

        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          if (char === '"') {
            insideQuotes = !insideQuotes
          } else if (char === "," && !insideQuotes) {
            values.push(currentValue.replace(/^"|"$/g, ""))
            currentValue = ""
          } else {
            currentValue += char
          }
        }
        values.push(currentValue.replace(/^"|"$/g, ""))

        // Extraire les valeurs
        const [kourelName, khassidaName, reference, duration] = values

        // Mettre à jour le nom du kourel si c'est la première ligne
        if (index === 0 && kourelName) {
          newKourel.name = kourelName
        }

        // Ajouter le khassida
        newKourel.khassidas.push({
          id: nextIdRef.current++,
          name: khassidaName || "",
          reference: reference || "",
          duration: duration || "00:00",
          seconds: durationToSeconds(duration || "00:00"),
        })
      })

      // Mettre à jour l'état
      setKourels([newKourel])
      setActiveKourelIndex(0)
      setRecordingIndex(-1)
      setIsTimerRunning(false)
      setCurrentSeconds(0)
    }

    reader.readAsText(file)

    // Réinitialiser l'input file pour permettre de charger le même fichier plusieurs fois
    if (event.target) {
      event.target.value = ""
    }
  }

  // Fonction pour convertir une durée au format "MM:SS" en secondes
  const durationToSeconds = (duration: string): number => {
    const [minutes, seconds] = duration.split(":").map(Number)
    return (minutes || 0) * 60 + (seconds || 0)
  }

  return (
    <div className="min-h-screen bg-[#f5f5e6] dark:bg-gray-900 transition-colors duration-200">
      <header className="p-4 flex justify-between items-center border-b border-green-800/20 dark:border-green-800/10">
        <div className="h-16 relative">
          <Image
            src="/images/logo.png"
            alt="MN Events Logo"
            width={250}
            height={80}
            className="h-full w-auto dark:brightness-110 dark:contrast-125"
          />
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <DatePickerWithCalendar />
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-green-800 dark:text-green-400">Les Prestations</h2>
              <Button
                variant="outline"
                className="text-green-800 border-green-800 hover:bg-green-50 dark:text-green-400 dark:border-green-400 dark:hover:bg-gray-800"
                onClick={cleanTable}
              >
                Clean table
              </Button>
            </div>

            <div
              className="bg-white dark:bg-gray-800 rounded-md overflow-hidden border border-green-800/20 dark:border-green-800/10"
              style={{ height: "calc(100vh - 240px)", minHeight: "300px", overflowY: "auto" }}
            >
              <Table>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="bg-gradient-to-r from-[#4d7c0f] to-[#65a30d] dark:from-[#4d7c0f] dark:to-[#65a30d]">
                    <TableHead className="font-medium text-white">Kourel</TableHead>
                    <TableHead className="font-medium text-white">Khassida</TableHead>
                    <TableHead className="font-medium text-white">Référence</TableHead>
                    <TableHead className="font-medium text-white">Durée</TableHead>
                    <TableHead className="font-medium text-white w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kourels.length > 0 ? (
                    kourels.map((kourel, kourelIndex) =>
                      kourel.khassidas.map((khassida, khassidaIndex) => (
                        <TableRow
                          key={khassida.id}
                          className={`
                            ${activeKourelIndex === kourelIndex && recordingIndex === khassidaIndex ? "bg-green-50 dark:bg-green-900/20" : ""}
                            dark:text-gray-200 dark:hover:bg-gray-700/50
                          `}
                          onClick={() => selectRowForRecording(kourelIndex, khassidaIndex)}
                          style={{ cursor: isTimerRunning ? "pointer" : "default" }}
                        >
                          {khassidaIndex === 0 && (
                            <TableCell
                              rowSpan={kourel.khassidas.length}
                              className="align-middle text-center border-r border-green-800/10 dark:border-green-800/20"
                            >
                              <EditableCell
                                value={kourel.name}
                                onChange={(value) => updateKourelName(kourelIndex, value)}
                              />
                            </TableCell>
                          )}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <RecordingIndicator
                                isRecording={
                                  activeKourelIndex === kourelIndex &&
                                  recordingIndex === khassidaIndex &&
                                  isTimerRunning
                                }
                              />
                              <EditableCell
                                value={khassida.name}
                                onChange={(value) => updateCell(kourelIndex, khassidaIndex, "name", value)}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <EditableCell
                              value={khassida.reference}
                              onChange={(value) => updateCell(kourelIndex, khassidaIndex, "reference", value)}
                            />
                          </TableCell>
                          <TableCell className="text-center">{khassida.duration}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                              onClick={(e) => deleteRow(kourelIndex, khassidaIndex, e)}
                              title="Supprimer cette ligne"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )),
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Aucune prestation disponible
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="bg-[#f5f5e6] text-green-800 border-green-800 hover:bg-green-50 dark:bg-gray-900 dark:text-green-400 dark:border-green-400 dark:hover:bg-gray-800"
                onClick={addService}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Service
              </Button>
              <Button
                variant="outline"
                className="bg-[#f5f5e6] text-green-800 border-green-800 hover:bg-green-50 dark:bg-gray-900 dark:text-green-400 dark:border-green-400 dark:hover:bg-gray-800"
                onClick={exportToCSV}
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                className="bg-[#f5f5e6] text-green-800 border-green-800 hover:bg-green-50 dark:bg-gray-900 dark:text-green-400 dark:border-green-400 dark:hover:bg-gray-800"
                onClick={triggerFileUpload}
              >
                <UploadIcon className="h-4 w-4 mr-2" />
                Upload from CSV
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <Button className="bg-green-700 hover:bg-green-800 ml-auto dark:bg-green-700 dark:hover:bg-green-600">
                <SaveIcon className="h-4 w-4 mr-2" />
                SAVE
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1 flex items-center h-[calc(100vh-240px)]">
            <div className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/30 rounded-xl p-3 border border-green-200 dark:border-green-800/30 flex flex-col items-center justify-center w-full shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="relative w-full flex justify-center items-center py-1">
                {/* Cercles d'animation réduits */}
                <div
                  className={`absolute w-40 h-40 rounded-full ${isTimerRunning ? "animate-pulse" : ""} bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/30 opacity-60`}
                ></div>

                <div
                  className={`absolute w-36 h-36 rounded-full ${isTimerRunning ? "animate-ping" : ""} animation-duration-3000 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-800/30 dark:to-green-700/30 opacity-30`}
                ></div>

                <Timer
                  isRunning={isTimerRunning}
                  initialSeconds={currentSeconds}
                  onTick={(seconds) => updateDuration(seconds)}
                  size="small"
                />
              </div>

              <Button
                className={`mt-4 w-full max-w-xs transition-all duration-300 transform hover:scale-105 rounded-full shadow-md ${
                  isTimerRunning
                    ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500"
                    : "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                }`}
                onClick={toggleRecording}
                disabled={kourels.length === 0 || kourels[0].khassidas.length === 0}
              >
                <div className="flex items-center justify-center gap-2 py-1">
                  {isTimerRunning ? (
                    <>
                      <div className="relative">
                        <PauseIcon className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-300 dark:bg-red-400 rounded-full animate-ping"></span>
                      </div>
                      <span className="font-medium">STOP</span>
                    </>
                  ) : (
                    <>
                      <PlayIcon className="h-5 w-5" />
                      <span className="font-medium">START</span>
                    </>
                  )}
                </div>
              </Button>

              {isTimerRunning && (
                <div className="mt-2 flex gap-2 items-center">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                  <span
                    className="inline-block w-2 h-2 bg-red-500 rounded-full animate-ping"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="inline-block w-2 h-2 bg-red-500 rounded-full animate-ping"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">Enregistrement</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
