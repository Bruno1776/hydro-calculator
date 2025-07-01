"use client"

import { useState, useEffect } from "react"
import SplashScreen from "@/components/splash-screen"
import Dashboard from "@/components/dashboard"
import CalculationView from "@/components/calculation-view"
import LearningView from "@/components/learning-view"
import AssessmentView from "@/components/assessment-view"
import type { CalculationHistory } from "@/types/calculation"

export type CalculationType = {
  id: string
  title: string
  description: string
  icon: string
  category: string
}

export type ViewMode = "splash" | "dashboard" | "calculation" | "learning" | "assessment"

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

export type BadgeType = {
  id: string
  title: string
  description: string
  icon: string
  type: "achievement" | "milestone" | "special" | "streak"
  earned: boolean
  earnedDate?: Date
  rarity: "common" | "rare" | "epic" | "legendary"
}

export type CertificationType = {
  id: string
  title: string
  description: string
  icon: string
  requirements: {
    calculations: number
    learningModules: number
    specificCalculations?: string[]
    assessmentScore?: number
    badges?: string[]
  }
  earned: boolean
  earnedDate?: Date
  level: "bronze" | "silver" | "gold" | "platinum" | "diamond"
  assessmentRequired: boolean
  assessmentPassed?: boolean
}

export type AssessmentResult = {
  calculationType: string
  score: number
  totalQuestions: number
  correctAnswers: number
  passed: boolean
  completedAt: Date
}

export const badges: BadgeType[] = [
  {
    id: "first-calculation",
    title: "Primeiro Passo",
    description: "Realize seu primeiro cálculo",
    icon: "🎯",
    type: "milestone",
    earned: false,
    rarity: "common",
  },
  {
    id: "first-certification",
    title: "Certificado Inicial",
    description: "Obtenha sua primeira certificação",
    icon: "🏅",
    type: "milestone",
    earned: false,
    rarity: "rare",
  },
  {
    id: "calculation-streak-5",
    title: "Sequência de 5",
    description: "Realize 5 cálculos em sequência",
    icon: "🔥",
    type: "streak",
    earned: false,
    rarity: "common",
  },
  {
    id: "calculation-streak-10",
    title: "Sequência de 10",
    description: "Realize 10 cálculos em sequência",
    icon: "⚡",
    type: "streak",
    earned: false,
    rarity: "rare",
  },
  {
    id: "perfect-assessment",
    title: "Perfeição",
    description: "Obtenha 100% em uma avaliação",
    icon: "💯",
    type: "achievement",
    earned: false,
    rarity: "epic",
  },
  {
    id: "all-modules-complete",
    title: "Estudioso",
    description: "Complete todos os módulos de aprendizado",
    icon: "📚",
    type: "achievement",
    earned: false,
    rarity: "rare",
  },
  {
    id: "speed-calculator",
    title: "Calculadora Rápida",
    description: "Realize 20 cálculos em um dia",
    icon: "⚡",
    type: "special",
    earned: false,
    rarity: "epic",
  },
  {
    id: "master-engineer",
    title: "Engenheiro Mestre",
    description: "Obtenha todas as certificações avançadas",
    icon: "👑",
    type: "achievement",
    earned: false,
    rarity: "legendary",
  },
  {
    id: "assessment-champion",
    title: "Campeão das Avaliações",
    description: "Passe em todas as avaliações com nota superior a 90%",
    icon: "🏆",
    type: "achievement",
    earned: false,
    rarity: "legendary",
  },
  {
    id: "early-adopter",
    title: "Pioneiro",
    description: "Um dos primeiros usuários do HydroCalc",
    icon: "🌟",
    type: "special",
    earned: false,
    rarity: "legendary",
  },
]

export const certifications: CertificationType[] = [
  {
    id: "hydraulic-basics",
    title: "Fundamentos Hidráulicos",
    description: "Domínio dos conceitos básicos de hidráulica",
    icon: "🎓",
    requirements: {
      calculations: 5,
      learningModules: 3,
    },
    earned: false,
    level: "bronze",
    assessmentRequired: false,
  },
  {
    id: "flow-expert",
    title: "Especialista em Fluxo",
    description: "Expertise em cálculos de vazão e velocidade",
    icon: "🌊",
    requirements: {
      calculations: 10,
      learningModules: 2,
      specificCalculations: ["pipe-flow", "flow-velocity"],
      assessmentScore: 80,
    },
    earned: false,
    level: "silver",
    assessmentRequired: true,
  },
  {
    id: "pressure-master",
    title: "Mestre em Pressão",
    description: "Domínio completo de cálculos de pressão",
    icon: "⚡",
    requirements: {
      calculations: 15,
      learningModules: 3,
      specificCalculations: ["pressure-drop", "head-loss"],
      assessmentScore: 85,
    },
    earned: false,
    level: "gold",
    assessmentRequired: true,
  },
  {
    id: "pump-specialist",
    title: "Especialista em Bombas",
    description: "Expertise em dimensionamento de bombas",
    icon: "🔧",
    requirements: {
      calculations: 8,
      learningModules: 2,
      specificCalculations: ["pump-power"],
      assessmentScore: 80,
    },
    earned: false,
    level: "silver",
    assessmentRequired: true,
  },
  {
    id: "reynolds-analyst",
    title: "Analista de Reynolds",
    description: "Especialista em análise de regime de fluxo",
    icon: "🔬",
    requirements: {
      calculations: 12,
      learningModules: 2,
      specificCalculations: ["reynolds-number"],
      assessmentScore: 85,
    },
    earned: false,
    level: "gold",
    assessmentRequired: true,
  },
  {
    id: "hydraulic-engineer",
    title: "Engenheiro Hidráulico Certificado",
    description: "Certificação completa em engenharia hidráulica",
    icon: "👨‍🎓",
    requirements: {
      calculations: 50,
      learningModules: 6,
      specificCalculations: [
        "head-loss",
        "pipe-flow",
        "pressure-drop",
        "pump-power",
        "flow-velocity",
        "reynolds-number",
      ],
      assessmentScore: 90,
      badges: ["perfect-assessment", "all-modules-complete"],
    },
    earned: false,
    level: "platinum",
    assessmentRequired: true,
  },
  // Advanced Certifications
  {
    id: "advanced-flow-dynamics",
    title: "Dinâmica de Fluidos Avançada",
    description: "Domínio avançado em mecânica dos fluidos computacional",
    icon: "🌪️",
    requirements: {
      calculations: 75,
      learningModules: 6,
      specificCalculations: ["pipe-flow", "flow-velocity", "reynolds-number"],
      assessmentScore: 95,
      badges: ["perfect-assessment", "calculation-streak-10"],
    },
    earned: false,
    level: "diamond",
    assessmentRequired: true,
  },
  {
    id: "industrial-hydraulics-expert",
    title: "Especialista em Hidráulica Industrial",
    description: "Expertise em sistemas hidráulicos industriais complexos",
    icon: "🏭",
    requirements: {
      calculations: 100,
      learningModules: 6,
      specificCalculations: ["pump-power", "pressure-drop", "head-loss"],
      assessmentScore: 95,
      badges: ["speed-calculator", "assessment-champion"],
    },
    earned: false,
    level: "diamond",
    assessmentRequired: true,
  },
  {
    id: "hydraulic-systems-architect",
    title: "Arquiteto de Sistemas Hidráulicos",
    description: "Capacidade de projetar sistemas hidráulicos complexos",
    icon: "🏗️",
    requirements: {
      calculations: 150,
      learningModules: 6,
      specificCalculations: [
        "head-loss",
        "pipe-flow",
        "pressure-drop",
        "pump-power",
        "flow-velocity",
        "reynolds-number",
      ],
      assessmentScore: 98,
      badges: ["master-engineer", "assessment-champion", "speed-calculator"],
    },
    earned: false,
    level: "diamond",
    assessmentRequired: true,
  },
]

export default function HydraulicApp() {
  const [currentView, setCurrentView] = useState<ViewMode>("splash")
  const [selectedCalculation, setSelectedCalculation] = useState<CalculationType | null>(null)
  const [isLearningMode, setIsLearningMode] = useState(false)
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistory[]>([])
  const [userCertifications, setUserCertifications] = useState<CertificationType[]>(certifications)
  const [userBadges, setUserBadges] = useState<BadgeType[]>(badges)
  const [completedLearningModules, setCompletedLearningModules] = useState<Set<string>>(new Set())
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([])
  const [calculationStreak, setCalculationStreak] = useState(0)
  const [lastCalculationDate, setLastCalculationDate] = useState<Date | null>(null)

  useEffect(() => {
    // Load all data from localStorage
    const savedHistory = localStorage.getItem("hydraulic-calc-history")
    if (savedHistory) {
      setCalculationHistory(JSON.parse(savedHistory))
    }

    const savedCertifications = localStorage.getItem("hydraulic-certifications")
    if (savedCertifications) {
      setUserCertifications(JSON.parse(savedCertifications))
    }

    const savedBadges = localStorage.getItem("hydraulic-badges")
    if (savedBadges) {
      setUserBadges(JSON.parse(savedBadges))
    }

    const savedModules = localStorage.getItem("hydraulic-learning-modules")
    if (savedModules) {
      setCompletedLearningModules(new Set(JSON.parse(savedModules)))
    }

    const savedAssessments = localStorage.getItem("hydraulic-assessments")
    if (savedAssessments) {
      setAssessmentResults(JSON.parse(savedAssessments))
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

    checkForNewBadges(calculationHistory, newCompletedModules, assessmentResults, calculationStreak)
    checkForNewCertifications(calculationHistory, newCompletedModules, assessmentResults)
  }

  const addAssessmentResult = (result: AssessmentResult) => {
    const newResults = [...assessmentResults, result]
    setAssessmentResults(newResults)
    localStorage.setItem("hydraulic-assessments", JSON.stringify(newResults))

    checkForNewBadges(calculationHistory, completedLearningModules, newResults, calculationStreak)
    checkForNewCertifications(calculationHistory, completedLearningModules, newResults)
  }

  const checkForNewBadges = (
    history: CalculationHistory[],
    completedModules: Set<string>,
    assessments: AssessmentResult[],
    streak: number,
  ) => {
    const updatedBadges = userBadges.map((badge) => {
      if (badge.earned) return badge

      let shouldEarn = false

      switch (badge.id) {
        case "first-calculation":
          shouldEarn = history.length >= 1
          break
        case "first-certification":
          shouldEarn = userCertifications.some((cert) => cert.earned)
          break
        case "calculation-streak-5":
          shouldEarn = streak >= 5
          break
        case "calculation-streak-10":
          shouldEarn = streak >= 10
          break
        case "perfect-assessment":
          shouldEarn = assessments.some((assessment) => assessment.score === 100)
          break
        case "all-modules-complete":
          shouldEarn = completedModules.size >= calculations.length
          break
        case "speed-calculator":
          const today = new Date()
          const todayCalculations = history.filter((calc) => {
            const calcDate = new Date(calc.timestamp)
            return calcDate.toDateString() === today.toDateString()
          })
          shouldEarn = todayCalculations.length >= 20
          break
        case "master-engineer":
          shouldEarn = userCertifications.filter((cert) => cert.earned && cert.level === "platinum").length >= 1
          break
        case "assessment-champion":
          const requiredAssessments = userCertifications.filter((cert) => cert.assessmentRequired).length
          const passedAssessments = assessments.filter((assessment) => assessment.score >= 90).length
          shouldEarn = passedAssessments >= requiredAssessments && requiredAssessments > 0
          break
        case "early-adopter":
          shouldEarn = true // Auto-grant to early users
          break
      }

      if (shouldEarn) {
        return {
          ...badge,
          earned: true,
          earnedDate: new Date(),
        }
      }

      return badge
    })

    setUserBadges(updatedBadges)
    localStorage.setItem("hydraulic-badges", JSON.stringify(updatedBadges))
  }

  const checkForNewCertifications = (
    history: CalculationHistory[],
    completedModules: Set<string>,
    assessments: AssessmentResult[],
  ) => {
    const updatedCertifications = userCertifications.map((cert) => {
      if (cert.earned) return cert

      const calculationCount = history.length
      const moduleCount = completedModules.size

      // Check specific calculations if required
      let specificCalcsCompleted = true
      if (cert.requirements.specificCalculations) {
        specificCalcsCompleted = cert.requirements.specificCalculations.every((calcType) => {
          return history.some((h) => h.calculationType === calcType) && completedModules.has(calcType)
        })
      }

      // Check assessment score if required
      let assessmentPassed = true
      if (cert.assessmentRequired && cert.requirements.assessmentScore) {
        const relevantAssessments = assessments.filter((assessment) =>
          cert.requirements.specificCalculations?.includes(assessment.calculationType),
        )
        assessmentPassed =
          relevantAssessments.length > 0 &&
          relevantAssessments.every((assessment) => assessment.score >= cert.requirements.assessmentScore!)
      }

      // Check required badges
      let badgesEarned = true
      if (cert.requirements.badges) {
        badgesEarned = cert.requirements.badges.every((badgeId) =>
          userBadges.some((badge) => badge.id === badgeId && badge.earned),
        )
      }

      // Check if requirements are met
      if (
        calculationCount >= cert.requirements.calculations &&
        moduleCount >= cert.requirements.learningModules &&
        specificCalcsCompleted &&
        assessmentPassed &&
        badgesEarned
      ) {
        return {
          ...cert,
          earned: true,
          earnedDate: new Date(),
          assessmentPassed: assessmentPassed,
        }
      }

      return cert
    })

    setUserCertifications(updatedCertifications)
    localStorage.setItem("hydraulic-certifications", JSON.stringify(updatedCertifications))
  }

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

    checkForNewBadges(newHistory, completedLearningModules, assessmentResults, newStreak)
    checkForNewCertifications(newHistory, completedLearningModules, assessmentResults)
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

  const handleAssessmentSelect = (calculation: CalculationType) => {
    setSelectedCalculation(calculation)
    setCurrentView("assessment")
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
        onAssessmentSelect={handleAssessmentSelect}
        calculationHistory={calculationHistory}
        onClearHistory={clearHistory}
        userCertifications={userCertifications}
        userBadges={userBadges}
        completedLearningModules={completedLearningModules}
        assessmentResults={assessmentResults}
        calculationStreak={calculationStreak}
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

  if (currentView === "assessment" && selectedCalculation) {
    return (
      <AssessmentView
        calculation={selectedCalculation}
        onBack={handleBackToDashboard}
        onAssessmentComplete={addAssessmentResult}
        previousResults={assessmentResults.filter((result) => result.calculationType === selectedCalculation.id)}
      />
    )
  }

  return null
}
