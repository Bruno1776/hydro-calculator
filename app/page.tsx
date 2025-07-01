"use client"

import { useState, useEffect } from "react"
import SplashScreen from "@/components/splash-screen"
import Dashboard from "@/components/dashboard"
import CalculationView from "@/components/calculation-view"
import LearningView from "@/components/learning-view"
import type { CalculationHistory } from "@/types/calculation"

export type CalculationType = {
  id: string
  title: string
  description: string
  icon: string
  category: string
}

export type ViewMode = "splash" | "dashboard" | "calculation" | "learning"

export const calculations: CalculationType[] = [
  {
    id: "head-loss",
    title: "Perda de Carga Localizada",
    description: "Calcule perdas de pressão em conexões, válvulas e componentes",
    icon: "🔧",
    category: "Perda de Pressão",
  },
  {
    id: "pipe-flow",
    title: "Vazão em Tubulações",
    description: "Determine a vazão através de tubos usando vários métodos",
    icon: "🌊",
    category: "Análise de Fluxo",
  },
  {
    id: "pressure-drop",
    title: "Perda de Pressão",
    description: "Calcule a perda de pressão ao longo de tubulações",
    icon: "📉",
    category: "Perda de Pressão",
  },
  {
    id: "pump-power",
    title: "Potência da Bomba",
    description: "Calcule a potência necessária e eficiência da bomba",
    icon: "⚡",
    category: "Projeto de Bombas",
  },
  {
    id: "flow-velocity",
    title: "Velocidade do Fluxo",
    description: "Determine a velocidade do fluido em tubos e canais",
    icon: "🏃",
    category: "Análise de Fluxo",
  },
  {
    id: "reynolds-number",
    title: "Número de Reynolds",
    description: "Calcule o número de Reynolds para determinação do regime de fluxo",
    icon: "🔢",
    category: "Análise de Fluxo",
  },
]

// BadgeType, CertificationType, badges, and certifications removed.

export default function HydraulicApp() {
  const [currentView, setCurrentView] = useState<ViewMode>("splash")
  const [selectedCalculation, setSelectedCalculation] = useState<CalculationType | null>(null)
  const [isLearningMode, setIsLearningMode] = useState(false)
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistory[]>([])
  // const [userCertifications, setUserCertifications] = useState<CertificationType[]>(certifications) // Removido
  // const [userBadges, setUserBadges] = useState<BadgeType[]>(badges) // Removido
  const [completedLearningModules, setCompletedLearningModules] = useState<Set<string>>(new Set())
  const [calculationStreak, setCalculationStreak] = useState(0)
  const [lastCalculationDate, setLastCalculationDate] = useState<Date | null>(null)

  useEffect(() => {
    // Load all data from localStorage
    const savedHistory = localStorage.getItem("hydraulic-calc-history")
    if (savedHistory) {
      setCalculationHistory(JSON.parse(savedHistory))
    }

    // const savedCertifications = localStorage.getItem("hydraulic-certifications") // Removido
    // if (savedCertifications) {
    //   setUserCertifications(JSON.parse(savedCertifications))
    // }

    // const savedBadges = localStorage.getItem("hydraulic-badges") // Removido
    // if (savedBadges) {
    //   setUserBadges(JSON.parse(savedBadges))
    // }

    const savedModules = localStorage.getItem("hydraulic-learning-modules")
    if (savedModules) {
      setCompletedLearningModules(new Set(JSON.parse(savedModules)))
    }

    const savedStreak = localStorage.getItem("hydraulic-streak")
    if (savedStreak) {
      setCalculationStreak(Number.parseInt(savedStreak))
    }

    const savedLastDate = localStorage.getItem("hydraulic-last-calculation")
    if (savedLastDate) {
      setLastCalculationDate(new Date(savedLastDate))
    }

    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setCurrentView("dashboard")
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const markLearningModuleComplete = (calculationId: string) => {
    const newCompletedModules = new Set(completedLearningModules)
    newCompletedModules.add(calculationId)
    setCompletedLearningModules(newCompletedModules)
    localStorage.setItem("hydraulic-learning-modules", JSON.stringify(Array.from(newCompletedModules)))

    // checkForNewBadges(calculationHistory, newCompletedModules, calculationStreak) // Removido
    // checkForNewCertifications(calculationHistory, newCompletedModules) // Removido
  }

  // Função checkForNewBadges removida

  // Função checkForNewCertifications removida

  const addToHistory = (calculation: CalculationHistory) => {
    const newHistory = [calculation, ...calculationHistory.slice(0, 49)]
    setCalculationHistory(newHistory)
    localStorage.setItem("hydraulic-calc-history", JSON.stringify(newHistory))

    // Update streak
    const today = new Date()
    const isConsecutiveDay =
      !lastCalculationDate || (today.getTime() - lastCalculationDate.getTime()) / (1000 * 60 * 60 * 24) <= 1

    const newStreak = isConsecutiveDay ? calculationStreak + 1 : 1
    setCalculationStreak(newStreak)
    setLastCalculationDate(today)
    localStorage.setItem("hydraulic-streak", newStreak.toString())
    localStorage.setItem("hydraulic-last-calculation", today.toISOString())

    // checkForNewBadges(newHistory, completedLearningModules, newStreak) // Removido
    // checkForNewCertifications(newHistory, completedLearningModules) // Removido
  }

  const clearHistory = () => {
    setCalculationHistory([])
    localStorage.removeItem("hydraulic-calc-history")
  }

  const handleCalculationSelect = (calculation: CalculationType) => {
    setSelectedCalculation(calculation)
    setIsLearningMode(false)
    setCurrentView("calculation")
  }

  const handleLearningSelect = (calculation: CalculationType) => {
    setSelectedCalculation(calculation)
    setIsLearningMode(true)
    setCurrentView("learning")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedCalculation(null)
    setIsLearningMode(false)
  }

  const toggleMode = () => {
    if (selectedCalculation) {
      setIsLearningMode(!isLearningMode)
      setCurrentView(isLearningMode ? "calculation" : "learning")
    }
  }

  if (currentView === "splash") {
    return <SplashScreen />
  }

  if (currentView === "dashboard") {
    return (
      <Dashboard
        calculations={calculations}
        onCalculationSelect={handleCalculationSelect}
        onLearningSelect={handleLearningSelect}
        // onAssessmentSelect={handleAssessmentSelect} // Removido
        calculationHistory={calculationHistory}
        onClearHistory={clearHistory}
        // userCertifications={userCertifications} // Removido
        // userBadges={userBadges} // Removido
        completedLearningModules={completedLearningModules} // Mantido para possível uso futuro no Dashboard
        // assessmentResults={assessmentResults} // Removido
        // calculationStreak={calculationStreak} // Removido
      />
    )
  }

  if (currentView === "calculation" && selectedCalculation) {
    return (
      <CalculationView
        calculation={selectedCalculation}
        onBack={handleBackToDashboard}
        onToggleMode={toggleMode}
        isLearningMode={isLearningMode}
        onAddToHistory={addToHistory}
      />
    )
  }

  if (currentView === "learning" && selectedCalculation) {
    return (
      <LearningView
        calculation={selectedCalculation}
        onBack={handleBackToDashboard}
        onToggleMode={toggleMode}
        isLearningMode={isLearningMode}
        onMarkModuleComplete={markLearningModuleComplete}
        isModuleCompleted={completedLearningModules.has(selectedCalculation.id)}
      />
    )
  }

  // Bloco de AssessmentView removido

  return null
}
