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
  Award,
  Trophy,
  Star,
  Share2,
  FileCheck,
  Zap,
} from "lucide-react"
import Image from "next/image"
import ShareModal from "@/components/share-modal"
import type { CalculationType, CertificationType, BadgeType, AssessmentResult } from "@/app/page"
import type { CalculationHistory } from "@/types/calculation"
import { useState } from "react"

interface DashboardProps {
  calculations: CalculationType[]
  onCalculationSelect: (calculation: CalculationType) => void
  onLearningSelect: (calculation: CalculationType) => void
  onAssessmentSelect: (calculation: CalculationType) => void
  calculationHistory: CalculationHistory[]
  onClearHistory: () => void
  userCertifications: CertificationType[]
  userBadges: BadgeType[]
  completedLearningModules: Set<string>
  assessmentResults: AssessmentResult[]
  calculationStreak: number
}

export default function Dashboard({
  calculations,
  onCalculationSelect,
  onLearningSelect,
  onAssessmentSelect,
  calculationHistory,
  onClearHistory,
  userCertifications,
  userBadges,
  completedLearningModules,
  assessmentResults,
  calculationStreak,
}: DashboardProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareContent, setShareContent] = useState<any>(null)

  const categories = [...new Set(calculations.map((calc) => calc.category))]
  const earnedCertifications = userCertifications.filter((cert) => cert.earned)
  const earnedBadges = userBadges.filter((badge) => badge.earned)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "bronze":
        return "text-amber-600 bg-amber-50 border-amber-200"
      case "silver":
        return "text-gray-600 bg-gray-50 border-gray-200"
      case "gold":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "platinum":
        return "text-purple-600 bg-purple-50 border-purple-200"
      case "diamond":
        return "text-cyan-600 bg-cyan-50 border-cyan-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-600 bg-gray-50 border-gray-200"
      case "rare":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "epic":
        return "text-purple-600 bg-purple-50 border-purple-200"
      case "legendary":
        return "text-orange-600 bg-orange-50 border-orange-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "bronze":
        return "🥉"
      case "silver":
        return "🥈"
      case "gold":
        return "🥇"
      case "platinum":
        return "💎"
      case "diamond":
        return "💠"
      default:
        return "🏆"
    }
  }

  const handleShare = (type: "certification" | "badge" | "achievement", content: any) => {
    setShareContent({ type, content })
    setShareModalOpen(true)
  }

  const getAssessmentScore = (calculationType: string) => {
    const results = assessmentResults.filter((result) => result.calculationType === calculationType)
    if (results.length === 0) return null
    return Math.max(...results.map((result) => result.score))
  }

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
              {calculationStreak > 0 && (
                <div className="flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">{calculationStreak}</span>
                </div>
              )}
              {earnedBadges.length > 0 && (
                <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">{earnedBadges.length}</span>
                </div>
              )}
              {earnedCertifications.length > 0 && (
                <div className="flex items-center space-x-2 bg-novaes-teal/10 px-3 py-1 rounded-full">
                  <Trophy className="w-4 h-4 text-novaes-teal" />
                  <span className="text-sm font-medium text-novaes-teal">{earnedCertifications.length}</span>
                </div>
              )}
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
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto bg-white/90 backdrop-blur-sm border-2 border-novaes-teal/20 shadow-lg">
            <TabsTrigger
              value="calculations"
              className="flex items-center space-x-2 font-medium transition-all duration-200 data-[state=active]:bg-novaes-teal data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-novaes-teal data-[state=inactive]:bg-white data-[state=inactive]:hover:bg-novaes-teal/10 data-[state=inactive]:hover:text-novaes-teal-dark"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Cálculos</span>
            </TabsTrigger>
            <TabsTrigger
              value="certifications"
              className="flex items-center space-x-2 font-medium transition-all duration-200 data-[state=active]:bg-novaes-teal data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-novaes-teal data-[state=inactive]:bg-white data-[state=inactive]:hover:bg-novaes-teal/10 data-[state=inactive]:hover:text-novaes-teal-dark"
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Certificações</span>
            </TabsTrigger>
            <TabsTrigger
              value="badges"
              className="flex items-center space-x-2 font-medium transition-all duration-200 data-[state=active]:bg-novaes-teal data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-novaes-teal data-[state=inactive]:bg-white data-[state=inactive]:hover:bg-novaes-teal/10 data-[state=inactive]:hover:text-novaes-teal-dark"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
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
                      const assessmentScore = getAssessmentScore(calculation.id)
                      return (
                        <Card
                          key={calculation.id}
                          className="hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-novaes-teal/30 bg-white/80 backdrop-blur-sm relative"
                        >
                          <div className="absolute top-2 right-2 flex space-x-1">
                            {completedLearningModules.has(calculation.id) && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                            {assessmentScore && (
                              <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                {assessmentScore}%
                              </div>
                            )}
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
                              <Button
                                variant="outline"
                                onClick={() => onAssessmentSelect(calculation)}
                                className="w-full text-sm border-purple-300 text-purple-600 hover:bg-purple-50"
                                size="sm"
                              >
                                <FileCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                Avaliação
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Certificações</h2>
              <p className="text-novaes-gray text-sm sm:text-base">
                Conquiste certificações demonstrando suas competências em hidráulica
              </p>
            </div>

            {/* Progress Overview */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-novaes-teal">Seu Progresso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-novaes-teal">{calculationHistory.length}</div>
                    <div className="text-sm text-novaes-gray">Cálculos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-novaes-teal">{completedLearningModules.size}</div>
                    <div className="text-sm text-novaes-gray">Módulos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-novaes-teal">{assessmentResults.length}</div>
                    <div className="text-sm text-novaes-gray">Avaliações</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-novaes-teal">{earnedCertifications.length}</div>
                    <div className="text-sm text-novaes-gray">Certificações</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Earned Certifications */}
            {earnedCertifications.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Certificações Obtidas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {earnedCertifications.map((cert) => (
                    <Card
                      key={cert.id}
                      className="bg-white/90 backdrop-blur-sm border-2 border-green-200 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-green-500 transform rotate-45 translate-x-8 -translate-y-8"></div>
                      <div className="absolute top-2 right-2">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{cert.icon}</span>
                          <div className="flex-1">
                            <CardTitle className="text-base leading-tight text-gray-900">{cert.title}</CardTitle>
                            <Badge className={`text-xs mt-1 ${getLevelColor(cert.level)}`}>
                              {getLevelIcon(cert.level)} {cert.level.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-novaes-gray mb-2">{cert.description}</p>
                        {cert.earnedDate && (
                          <p className="text-xs text-green-600 font-medium mb-2">
                            Obtida em: {formatDate(cert.earnedDate)}
                          </p>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare("certification", cert)}
                          className="w-full text-xs border-green-300 text-green-600 hover:bg-green-50"
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          Compartilhar
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Available Certifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Certificações Disponíveis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userCertifications
                  .filter((cert) => !cert.earned)
                  .map((cert) => {
                    const calculationProgress = Math.min(calculationHistory.length / cert.requirements.calculations, 1)
                    const moduleProgress = Math.min(
                      completedLearningModules.size / cert.requirements.learningModules,
                      1,
                    )
                    const specificProgress = cert.requirements.specificCalculations
                      ? cert.requirements.specificCalculations.filter(
                          (calcType) =>
                            calculationHistory.some((h) => h.calculationType === calcType) &&
                            completedLearningModules.has(calcType),
                        ).length / cert.requirements.specificCalculations.length
                      : 1

                    const assessmentProgress = cert.assessmentRequired
                      ? cert.requirements.specificCalculations
                        ? cert.requirements.specificCalculations.filter((calcType) => {
                            const score = getAssessmentScore(calcType)
                            return score && score >= (cert.requirements.assessmentScore || 0)
                          }).length / cert.requirements.specificCalculations.length
                        : 0
                      : 1

                    const overallProgress =
                      (calculationProgress + moduleProgress + specificProgress + assessmentProgress) / 4

                    return (
                      <Card key={cert.id} className="bg-white/80 backdrop-blur-sm border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl opacity-60">{cert.icon}</span>
                            <div className="flex-1">
                              <CardTitle className="text-base leading-tight text-gray-900">{cert.title}</CardTitle>
                              <Badge className={`text-xs mt-1 ${getLevelColor(cert.level)}`}>
                                {getLevelIcon(cert.level)} {cert.level.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-novaes-gray mb-3">{cert.description}</p>

                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span>Cálculos:</span>
                              <span className={calculationProgress >= 1 ? "text-green-600" : "text-novaes-gray"}>
                                {calculationHistory.length}/{cert.requirements.calculations}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Módulos:</span>
                              <span className={moduleProgress >= 1 ? "text-green-600" : "text-novaes-gray"}>
                                {completedLearningModules.size}/{cert.requirements.learningModules}
                              </span>
                            </div>
                            {cert.requirements.specificCalculations && (
                              <div className="flex justify-between">
                                <span>Específicos:</span>
                                <span className={specificProgress >= 1 ? "text-green-600" : "text-novaes-gray"}>
                                  {Math.round(specificProgress * cert.requirements.specificCalculations.length)}/
                                  {cert.requirements.specificCalculations.length}
                                </span>
                              </div>
                            )}
                            {cert.assessmentRequired && (
                              <div className="flex justify-between">
                                <span>Avaliações:</span>
                                <span className={assessmentProgress >= 1 ? "text-green-600" : "text-novaes-gray"}>
                                  {cert.requirements.assessmentScore}% mín.
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-novaes-teal h-2 rounded-full transition-all duration-300"
                                style={{ width: `${overallProgress * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-center mt-1 text-novaes-gray">
                              {Math.round(overallProgress * 100)}% completo
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Badges e Conquistas</h2>
              <p className="text-novaes-gray text-sm sm:text-base">
                Desbloqueie badges especiais demonstrando suas habilidades e dedicação
              </p>
            </div>

            {/* Earned Badges */}
            {earnedBadges.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Badges Conquistados</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {earnedBadges.map((badge) => (
                    <Card
                      key={badge.id}
                      className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 relative overflow-hidden text-center"
                    >
                      <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500 transform rotate-45 translate-x-6 -translate-y-6"></div>
                      <CardContent className="p-4">
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{badge.title}</h4>
                        <p className="text-xs text-novaes-gray mb-2">{badge.description}</p>
                        <Badge className={`text-xs ${getRarityColor(badge.rarity)}`}>
                          {badge.rarity.toUpperCase()}
                        </Badge>
                        {badge.earnedDate && (
                          <p className="text-xs text-purple-600 font-medium mt-2">{formatDate(badge.earnedDate)}</p>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare("badge", badge)}
                          className="w-full text-xs border-purple-300 text-purple-600 hover:bg-purple-50 mt-2"
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          Compartilhar
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Available Badges */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Badges Disponíveis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {userBadges
                  .filter((badge) => !badge.earned)
                  .map((badge) => (
                    <Card key={badge.id} className="bg-white/80 backdrop-blur-sm border-gray-200 text-center">
                      <CardContent className="p-4">
                        <div className="text-3xl mb-2 opacity-40">{badge.icon}</div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{badge.title}</h4>
                        <p className="text-xs text-novaes-gray mb-2">{badge.description}</p>
                        <Badge className={`text-xs ${getRarityColor(badge.rarity)} opacity-60`}>
                          {badge.rarity.toUpperCase()}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>

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

      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} content={shareContent} />
    </div>
  )
}
