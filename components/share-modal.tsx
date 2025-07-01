"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Share2, Copy, ExternalLink, Check, Facebook, Twitter, Linkedin, Instagram, MessageCircle } from "lucide-react"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  content: {
    type: "certification" | "badge" | "achievement"
    content: any
  } | null
}

export default function ShareModal({ isOpen, onClose, content }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  if (!content) return null

  const generateShareText = () => {
    const { type, content: item } = content

    switch (type) {
      case "certification":
        return `🎓 Acabei de conquistar a certificação "${item.title}" no HydroCalc! 
        
Nível: ${item.level.toUpperCase()} ${getLevelIcon(item.level)}
Descrição: ${item.description}

#HydroCalc #EngenhariaCivil #Certificação #AprendizadoContinuo`

      case "badge":
        return `🏆 Novo badge desbloqueado no HydroCalc: "${item.title}"!

${item.icon} ${item.description}
Raridade: ${item.rarity.toUpperCase()}

Continuando minha jornada de aprendizado em engenharia hidráulica! 💪

#HydroCalc #Badge #EngenhariaCivil #Conquista`

      default:
        return `🚀 Nova conquista no HydroCalc! Continuando meus estudos em engenharia hidráulica.

#HydroCalc #EngenhariaCivil #Aprendizado`
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

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "⚪"
      case "rare":
        return "🔵"
      case "epic":
        return "🟣"
      case "legendary":
        return "🟠"
      default:
        return "⚪"
    }
  }

  const shareText = generateShareText()
  const encodedText = encodeURIComponent(shareText)
  const appUrl = "https://hydrocalc.app" // URL do seu app

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Erro ao copiar:", err)
    }
  }

  const shareToInstagram = () => {
    // Instagram não suporta compartilhamento direto via URL
    // Vamos copiar o texto e dar instruções
    copyToClipboard()
    alert("Texto copiado! Cole no Instagram Stories ou Feed para compartilhar sua conquista.")
  }

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodedText}`,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(appUrl)}`,
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}&summary=${encodedText}`,
      color: "bg-blue-700 hover:bg-blue-800",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedText}%20${encodeURIComponent(appUrl)}`,
      color: "bg-green-600 hover:bg-green-700",
    },
  ]

  const openShareLink = (url: string) => {
    window.open(url, "_blank", "width=600,height=400,scrollbars=yes,resizable=yes")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Compartilhar Conquista</span>
          </DialogTitle>
          <DialogDescription>Mostre sua conquista para seus colegas e inspire outros engenheiros!</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview da conquista */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {content.type === "certification" ? content.content.icon : content.content.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{content.content.title}</h3>
                  <p className="text-sm text-gray-600">{content.content.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {content.type === "certification" && (
                      <Badge className="text-xs">
                        {getLevelIcon(content.content.level)} {content.content.level.toUpperCase()}
                      </Badge>
                    )}
                    {content.type === "badge" && (
                      <Badge className="text-xs">
                        {getRarityIcon(content.content.rarity)} {content.content.rarity.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Texto para compartilhar */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Texto para compartilhar:</label>
            <div className="relative">
              <textarea
                value={shareText}
                readOnly
                className="w-full p-3 text-sm border border-gray-300 rounded-md bg-gray-50 resize-none"
                rows={6}
              />
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 bg-transparent"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Botões de compartilhamento */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Compartilhar em:</label>

            <div className="grid grid-cols-2 gap-2">
              {shareLinks.map((platform) => (
                <Button
                  key={platform.name}
                  onClick={() => openShareLink(platform.url)}
                  className={`${platform.color} text-white`}
                  size="sm"
                >
                  <platform.icon className="w-4 h-4 mr-2" />
                  {platform.name}
                </Button>
              ))}
            </div>

            {/* Instagram com tratamento especial */}
            <Button
              onClick={shareToInstagram}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              size="sm"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </Button>
          </div>

          {/* Dica */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <ExternalLink className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Dica:</p>
                <p>
                  Compartilhe suas conquistas para inspirar outros engenheiros e mostrar seu progresso profissional!
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
