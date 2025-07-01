"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calculator,
  BookOpen,
  History,
  Trash2,
  Clock,
  Leaf,
  // Award, // Removido
  // Trophy, // Removido
  Star,
  // Share2, // Removido
  // FileCheck, // Removido
  // Zap, // Removido
} from "lucide-react"
import Image from "next/image"
// import ShareModal from "@/components/share-modal" // Removido
import type { CalculationType, /*CertificationType, BadgeType, AssessmentResult*/ } from "@/app/page" // Tipos não usados removidos
import type { CalculationHistory } from "@/types/calculation"
// import { useState } from "react" // Removido: useState não é mais necessário aqui

interface DashboardProps {
  calculations: CalculationType[]
  onCalculationSelect: (calculation: CalculationType) => void
  onLearningSelect: (calculation: CalculationType) => void
  // onAssessmentSelect: (calculation: CalculationType) => void // Removido
  calculationHistory: CalculationHistory[]
  onClearHistory: () => void
  // userCertifications: CertificationType[] // Removido
  // userBadges: BadgeType[] // Removido
  completedLearningModules: Set<string> // Mantido
  // assessmentResults: AssessmentResult[] // Removido
  // calculationStreak: number // Removido
}

export default function Dashboard({
  calculations,
  onCalculationSelect,
  onLearningSelect,
  // onAssessmentSelect, // Removido
  calculationHistory,
  onClearHistory,
  // userCertifications, // Removido
  // userBadges, // Removido
  completedLearningModules,
  // assessmentResults, // Removido
  // calculationStreak, // Removido
}: DashboardProps) {
  // const [shareModalOpen, setShareModalOpen] = useState(false) // Removido
  // const [shareContent, setShareContent] = useState<any>(null) // Removido

  const categories = [...new Set(calculations.map((calc) => calc.category))]

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Funções getLevelColor, getRarityColor, getLevelIcon removidas pois não são mais utilizadas.

  // const handleShare = (type: "certification" | "badge" | "achievement", content: any) => { // Removido
  //   setShareContent({ type, content })
  //   setShareModalOpen(true)
  // }

  // const getAssessmentScore = (calculationType: string) => { // Removido
  //   const results = assessmentResults.filter((result) => result.calculationType === calculationType)
  //   if (results.length === 0) return null
  //   return Math.max(...results.map((result) => result.score))
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <header className="bg-white shadow-sm border-b border-gray-200/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/images/logo-grupo-novaes.png"
                  alt="Grupo Novaes"
                  width={120}
                  height={40}
                  className="h-8 w-auto sm:h-10"
                />
              </div>
              <div className="hidden sm:block w-px h-8 bg-gray-300"></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-novaes-teal">HydroCalc</h1>
                <p className="text-sm sm:text-base text-novaes-gray">Ferramentas de Engenharia Hidráulica</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/*calculationStreak, earnedBadges, earnedCertifications display removed */}
              <div className="flex items-center space-x-2 text-novaes-teal">
                <Leaf className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Sustentável</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs defaultValue="calculations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-white/90 backdrop-blur-sm border-2 border-novaes-teal/20 shadow-lg"> {/* Ajustado para grid-cols-2 e max-w-md */}
            <TabsTrigger
              value="calculations"
              className="flex items-center space-x-2 font-medium transition-all duration-200 data-[state=active]:bg-novaes-teal data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-novaes-teal data-[state=inactive]:bg-white data-[state=inactive]:hover:bg-novaes-teal/10 data-[state=inactive]:hover:text-novaes-teal-dark"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Cálculos</span>
            </TabsTrigger>
            {/* TabsTrigger for Certifications and Badges removed */}
            <TabsTrigger
              value="history"
              className="flex items-center space-x-2 font-medium transition-all duration-200 data-[state=active]:bg-novaes-teal data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-novaes-teal data-[state=inactive]:bg-white data-[state=inactive]:hover:bg-novaes-teal/10 data-[state=inactive]:hover:text-novaes-teal-dark"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Histórico</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculations" className="space-y-6 sm:space-y-8">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Cálculos Disponíveis</h2>
              <p className="text-novaes-gray text-sm sm:text-base">
                Selecione um cálculo para começar, explore os materiais de aprendizado ou faça uma avaliação
              </p>
            </div>

            {categories.map((category) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center justify-center sm:justify-start">
                  <Badge variant="outline" className="text-xs sm:text-sm border-novaes-teal text-novaes-teal">
                    {category}
                  </Badge>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {calculations
                    .filter((calc) => calc.category === category)
                    .map((calculation) => {
                      // const assessmentScore = getAssessmentScore(calculation.id) // Removido
                      return (
                        <Card
                          key={calculation.id}
                          className="hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-novaes-teal/30 bg-white/80 backdrop-blur-sm relative"
                        >
                          <div className="absolute top-2 right-2 flex space-x-1">
                            {completedLearningModules.has(calculation.id) && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                            {/* {assessmentScore && ( // Removido
                              <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                {assessmentScore}%
                              </div>
                            )} */}
                          </div>
                          <CardHeader className="pb-3">
                            <div className="flex items-center space-x-3">
                              <span className="text-xl sm:text-2xl">{calculation.icon}</span>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base sm:text-lg leading-tight text-gray-900">
                                  {calculation.title}
                                </CardTitle>
                              </div>
                            </div>
                            <CardDescription className="mt-2 text-sm leading-relaxed text-novaes-gray">
                              {calculation.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => onCalculationSelect(calculation)}
                                  className="flex-1 text-sm bg-novaes-teal hover:bg-novaes-teal-dark"
                                  size="sm"
                                >
                                  <Calculator className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                  Calcular
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => onLearningSelect(calculation)}
                                  className="flex-1 text-sm border-novaes-teal text-novaes-teal hover:bg-novaes-teal hover:text-white"
                                  size="sm"
                                >
                                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                  Aprender
                                </Button>
                              </div>
                              {/* Botão de Avaliação removido */}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* TabsContent for certifications and badges removed */}

          <TabsContent value="history" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Histórico de Cálculos</h2>
                <p className="text-novaes-gray text-sm sm:text-base">
                  {calculationHistory.length} cálculo{calculationHistory.length !== 1 ? "s" : ""} realizado
                  {calculationHistory.length !== 1 ? "s" : ""}
                </p>
              </div>
              {calculationHistory.length > 0 && (
                <Button
                  variant="outline"
                  onClick={onClearHistory}
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Histórico
                </Button>
              )}
            </div>

            {calculationHistory.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="w-12 h-12 text-novaes-gray/50 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cálculo realizado</h3>
                  <p className="text-novaes-gray text-sm">Seus cálculos aparecerão aqui após serem realizados</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {calculationHistory.map((calc) => (
                  <Card key={calc.id} className="bg-white/80 backdrop-blur-sm border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <CardTitle className="text-base sm:text-lg text-gray-900">{calc.calculationTitle}</CardTitle>
                        <Badge variant="secondary" className="text-xs w-fit bg-novaes-teal/10 text-novaes-teal">
                          {formatDate(calc.timestamp)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Entradas:</h4>
                          <div className="space-y-1">
                            {Object.entries(calc.inputs).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-novaes-gray">{key}:</span>
                                <span className="font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Resultados:</h4>
                          <div className="space-y-1">
                            {Object.entries(calc.results).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-novaes-gray">{key}:</span>
                                <span className="font-medium text-novaes-teal">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} content={shareContent} /> */} {/* Removido */}
    </div>
  )
}
