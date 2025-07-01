"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, X } from "lucide-react"
import type { CertificationType } from "@/app/page"

interface CertificationNotificationProps {
  certification: CertificationType | null
  onClose: () => void
}

export default function CertificationNotification({ certification, onClose }: CertificationNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (certification) {
      setIsVisible(true)
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [certification, onClose])

  if (!certification) return null

  const getLevelColor = (level: string) => {
    switch (level) {
      case "bronze":
        return "from-amber-400 to-amber-600"
      case "silver":
        return "from-gray-400 to-gray-600"
      case "gold":
        return "from-yellow-400 to-yellow-600"
      case "platinum":
        return "from-purple-400 to-purple-600"
      default:
        return "from-gray-400 to-gray-600"
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
      default:
        return "🏆"
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className="w-80 bg-white shadow-2xl border-2 border-novaes-teal/30 overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${getLevelColor(certification.level)}`}></div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Trophy className="w-8 h-8 text-novaes-teal" />
                <span className="absolute -top-1 -right-1 text-lg">{getLevelIcon(certification.level)}</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Nova Certificação!</h3>
                <p className="text-xs text-novaes-gray">Parabéns pela conquista</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false)
                setTimeout(onClose, 300)
              }}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{certification.icon}</span>
              <h4 className="font-semibold text-gray-900 text-sm">{certification.title}</h4>
            </div>
            <p className="text-xs text-novaes-gray leading-relaxed">{certification.description}</p>
            <div className="flex items-center justify-between pt-2">
              <span
                className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getLevelColor(certification.level)} text-white font-medium`}
              >
                {certification.level.toUpperCase()}
              </span>
              <span className="text-xs text-novaes-gray">{certification.earnedDate?.toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
