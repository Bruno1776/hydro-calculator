"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

export default function SplashScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 60)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-novaes-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-white/20 rounded-full"></div>
      </div>

      <div className="text-center space-y-6 sm:space-y-8 max-w-md w-full relative z-10">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Image
                src="/images/logo-white.png"
                alt="Grupo Novaes"
                width={200}
                height={80}
                className="float-animation"
                priority
              />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">HydroCalc</h1>
            <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 px-4 font-medium">
              Cálculos Hidráulicos Sustentáveis
            </p>
            <p className="text-sm text-white/80 px-4">Soluções de Engenharia para um Futuro Sustentável</p>
          </div>
        </div>

        <div className="w-full max-w-xs mx-auto space-y-4">
          <Progress value={progress} className="h-3 bg-white/20" />
          <p className="text-white/80 text-sm">Carregando módulos de cálculo...</p>
        </div>

        <div className="text-white/70 text-sm">
          <div>v2.0.0 - Grupo Novaes</div>
          <div className="text-xs mt-1">Engenharia Sustentável</div>
        </div>
      </div>
    </div>
  )
}
