"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileDown, Download, Printer, Share2 } from "lucide-react"
import type { CalculationHistory } from "@/types/calculation"
import type { CertificationType } from "@/app/page"

interface PDFExportProps {
  type: "history" | "certificate" | "calculation"
  data: CalculationHistory[] | CertificationType | CalculationHistory
  title: string
}

export default function PDFExport({ type, data, title }: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      // Create a new window for PDF generation
      const printWindow = window.open("", "_blank", "width=800,height=600")
      if (!printWindow) {
        alert("Por favor, habilite os popups para gerar o PDF")
        return
      }

      let htmlContent = ""

      if (type === "history" && Array.isArray(data)) {
        htmlContent = generateHistoryPDF(data as CalculationHistory[])
      } else if (type === "certificate" && !Array.isArray(data)) {
        htmlContent = generateCertificatePDF(data as CertificationType)
      } else if (type === "calculation" && !Array.isArray(data)) {
        htmlContent = generateCalculationPDF(data as CalculationHistory)
      }

      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print()
      }, 1000)
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      alert("Erro ao gerar PDF. Verifique se os popups estão habilitados.")
    } finally {
      setIsGenerating(false)
    }
  }

  const generateHistoryPDF = (history: CalculationHistory[]): string => {
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Histórico de Cálculos - HydroCalc</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            margin: 20px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #0891b2;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #0891b2;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 16px;
            color: #666;
          }
          .calculation {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .calc-title {
            font-size: 18px;
            font-weight: bold;
            color: #0891b2;
            margin-bottom: 10px;
          }
          .calc-date {
            font-size: 12px;
            color: #666;
            margin-bottom: 15px;
          }
          .calc-section {
            margin-bottom: 15px;
          }
          .section-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
            font-size: 14px;
          }
          .calc-data {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .data-item {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px dotted #ccc;
          }
          .data-label {
            color: #666;
          }
          .data-value {
            font-weight: bold;
            color: #0891b2;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          @media print {
            body { margin: 0; }
            .calculation { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">HydroCalc</div>
          <div class="subtitle">Relatório de Histórico de Cálculos</div>
          <div class="subtitle">Gerado em: ${formatDate(new Date())}</div>
        </div>

        <div class="content">
          <h2>Resumo</h2>
          <p><strong>Total de cálculos realizados:</strong> ${history.length}</p>
          <p><strong>Período:</strong> ${history.length > 0 ? formatDate(history[history.length - 1].timestamp) : "N/A"} até ${history.length > 0 ? formatDate(history[0].timestamp) : "N/A"}</p>

          <h2>Detalhamento dos Cálculos</h2>
          ${history
            .map(
              (calc, index) => `
            <div class="calculation">
              <div class="calc-title">${index + 1}. ${calc.calculationTitle}</div>
              <div class="calc-date">Realizado em: ${formatDate(calc.timestamp)}</div>
              
              <div class="calc-data">
                <div class="calc-section">
                  <div class="section-title">Parâmetros de Entrada</div>
                  ${Object.entries(calc.inputs)
                    .map(
                      ([key, value]) => `
                    <div class="data-item">
                      <span class="data-label">${key}:</span>
                      <span class="data-value">${value}</span>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
                
                <div class="calc-section">
                  <div class="section-title">Resultados Obtidos</div>
                  ${Object.entries(calc.results)
                    .map(
                      ([key, value]) => `
                    <div class="data-item">
                      <span class="data-label">${key}:</span>
                      <span class="data-value">${value}</span>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>

        <div class="footer">
          <p>Documento gerado pelo HydroCalc - Ferramentas de Engenharia Hidráulica</p>
          <p>Grupo Novaes © ${new Date().getFullYear()}</p>
        </div>
      </body>
      </html>
    `
  }

  const generateCertificatePDF = (cert: CertificationType): string => {
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    }

    const getLevelColor = (level: string) => {
      switch (level) {
        case "bronze":
          return "#d97706"
        case "silver":
          return "#6b7280"
        case "gold":
          return "#eab308"
        case "platinum":
          return "#8b5cf6"
        case "diamond":
          return "#06b6d4"
        default:
          return "#6b7280"
      }
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificado - ${cert.title}</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .certificate {
            background: white;
            border: 8px solid ${getLevelColor(cert.level)};
            border-radius: 20px;
            padding: 60px;
            max-width: 800px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            position: relative;
          }
          .certificate::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid ${getLevelColor(cert.level)};
            border-radius: 12px;
          }
          .header {
            margin-bottom: 40px;
          }
          .logo {
            font-size: 36px;
            font-weight: bold;
            color: #0891b2;
            margin-bottom: 10px;
          }
          .cert-title {
            font-size: 24px;
            color: #333;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .recipient {
            font-size: 32px;
            font-weight: bold;
            color: ${getLevelColor(cert.level)};
            margin: 30px 0;
            text-decoration: underline;
          }
          .achievement {
            font-size: 48px;
            margin: 20px 0;
          }
          .cert-name {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin: 20px 0;
          }
          .description {
            font-size: 16px;
            color: #666;
            margin: 20px 0;
            line-height: 1.6;
          }
          .level-badge {
            display: inline-block;
            background: ${getLevelColor(cert.level)};
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 20px 0;
          }
          .date {
            font-size: 14px;
            color: #666;
            margin-top: 40px;
          }
          .signature-section {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .signature {
            text-align: center;
            flex: 1;
          }
          .signature-line {
            border-top: 2px solid #333;
            width: 200px;
            margin: 0 auto 10px;
          }
          .signature-title {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(8, 145, 178, 0.05);
            font-weight: bold;
            z-index: 0;
          }
          .content {
            position: relative;
            z-index: 1;
          }
          @media print {
            body { 
              background: white;
              padding: 0;
            }
            .certificate {
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="watermark">HYDRO<br>CALC</div>
          <div class="content">
            <div class="header">
              <div class="logo">HydroCalc</div>
              <div class="cert-title">Certificado de Competência</div>
            </div>

            <div class="recipient">Usuário HydroCalc</div>

            <p style="font-size: 18px; margin: 20px 0;">
              Certificamos que o portador demonstrou competência e domínio em:
            </p>

            <div class="achievement">${cert.icon}</div>
            <div class="cert-name">${cert.title}</div>
            
            <div class="level-badge">${cert.level.toUpperCase()}</div>

            <div class="description">
              ${cert.description}
            </div>

            <div class="date">
              Certificado obtido em: ${cert.earnedDate ? formatDate(cert.earnedDate) : formatDate(new Date())}
            </div>

            <div class="signature-section">
              <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-title">HydroCalc System</div>
              </div>
              <div style="text-align: center;">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjgiIHN0cm9rZT0iIzA4OTFiMiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Im0yMCAzMCA4IDggMTItMTIiIHN0cm9rZT0iIzA4OTFiMiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+" alt="Selo" style="width: 60px; height: 60px;">
              </div>
              <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-title">Grupo Novaes</div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  const generateCalculationPDF = (calc: CalculationHistory): string => {
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    const renderMathForPDF = (formula: string): string => {
      // Convert LaTeX to HTML for PDF
      let formatted = formula

      // Basic LaTeX to HTML conversion for PDF
      formatted = formatted.replace(/\\times/g, "×")
      formatted = formatted.replace(/\\cdot/g, "·")
      formatted = formatted.replace(/\\div/g, "÷")
      formatted = formatted.replace(/\\pi/g, "π")
      formatted = formatted.replace(/\\rho/g, "ρ")
      formatted = formatted.replace(/\\mu/g, "μ")
      formatted = formatted.replace(/\\Delta/g, "Δ")

      // Handle fractions
      formatted = formatted.replace(
        /\\frac\{([^}]+)\}\{([^}]+)\}/g,
        '<span style="display: inline-block; text-align: center; vertical-align: middle;"><span style="display: block; border-bottom: 1px solid black; padding: 0 4px;">$1</span><span style="display: block; padding: 0 4px;">$2</span></span>',
      )

      // Handle superscripts
      formatted = formatted.replace(/\^{([^}]+)}/g, "<sup>$1</sup>")
      formatted = formatted.replace(/\^(\w)/g, "<sup>$1</sup>")

      // Handle subscripts
      formatted = formatted.replace(/_{([^}]+)}/g, "<sub>$1</sub>")
      formatted = formatted.replace(/_(\w)/g, "<sub>$1</sub>")

      return formatted
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Cálculo - ${calc.calculationTitle}</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            margin: 20px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #0891b2;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #0891b2;
            margin-bottom: 10px;
          }
          .calc-title {
            font-size: 24px;
            color: #333;
            margin: 20px 0;
          }
          .calc-date {
            font-size: 14px;
            color: #666;
          }
          .section {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #0891b2;
            margin-bottom: 15px;
            border-bottom: 2px solid #0891b2;
            padding-bottom: 5px;
          }
          .data-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .data-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dotted #ccc;
          }
          .data-label {
            color: #666;
            font-weight: normal;
          }
          .data-value {
            font-weight: bold;
            color: #0891b2;
          }
          .step {
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-left: 4px solid #0891b2;
            border-radius: 4px;
          }
          .step-number {
            font-weight: bold;
            color: #0891b2;
            margin-bottom: 10px;
          }
          .formula {
            background: #e0f2fe;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
            font-family: 'Times New Roman', serif;
            text-align: center;
            border: 1px solid #0891b2;
          }
          .result-highlight {
            background: #dcfce7;
            padding: 15px;
            border-radius: 8px;
            border: 2px solid #16a34a;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            color: #15803d;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          @media print {
            body { margin: 0; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">HydroCalc</div>
          <div class="calc-title">${calc.calculationTitle}</div>
          <div class="calc-date">Relatório gerado em: ${formatDate(new Date())}</div>
          <div class="calc-date">Cálculo realizado em: ${formatDate(calc.timestamp)}</div>
        </div>

        <div class="section">
          <div class="section-title">Parâmetros de Entrada</div>
          <div class="data-grid">
            ${Object.entries(calc.inputs)
              .map(
                ([key, value]) => `
              <div class="data-item">
                <span class="data-label">${key}:</span>
                <span class="data-value">${value}</span>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

        ${
          calc.steps
            ? `
          <div class="section">
            <div class="section-title">Desenvolvimento do Cálculo</div>
            ${calc.steps
              .map(
                (step, index) => `
              <div class="step">
                <div class="step-number">Passo ${step.step}: ${step.description}</div>
                
                <div style="margin: 10px 0;">
                  <strong>Fórmula:</strong>
                  <div class="formula">${renderMathForPDF(step.formula)}</div>
                </div>
                
                <div style="margin: 10px 0;">
                  <strong>Substituição:</strong>
                  <div class="formula">${renderMathForPDF(step.calculation)}</div>
                </div>
                
                <div style="margin: 10px 0;">
                  <strong>Resultado:</strong>
                  <div class="result-highlight">${step.result}</div>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }

        <div class="section">
          <div class="section-title">Resultados Finais</div>
          <div class="data-grid">
            ${Object.entries(calc.results)
              .map(
                ([key, value]) => `
              <div class="data-item">
                <span class="data-label">${key}:</span>
                <span class="data-value">${value}</span>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

        <div class="footer">
          <p>Documento gerado pelo HydroCalc - Ferramentas de Engenharia Hidráulica</p>
          <p>Grupo Novaes © ${new Date().getFullYear()}</p>
          <p><em>Este documento foi gerado automaticamente e contém cálculos baseados nos parâmetros fornecidos.</em></p>
        </div>
      </body>
      </html>
    `
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent">
          <FileDown className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar para PDF</DialogTitle>
          <DialogDescription>Gere um documento PDF profissional com {title.toLowerCase()}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Printer className="w-4 h-4 mr-2" />
                {title}
              </CardTitle>
              <CardDescription className="text-sm">
                {type === "history" && `${Array.isArray(data) ? data.length : 0} cálculos serão incluídos no relatório`}
                {type === "certificate" && "Certificado oficial com selo de autenticidade"}
                {type === "calculation" && "Relatório detalhado com passo a passo do cálculo"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {type === "history" && "Histórico"}
                    {type === "certificate" && "Certificado"}
                    {type === "calculation" && "Cálculo"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    PDF
                  </Badge>
                </div>
                <Button onClick={generatePDF} disabled={isGenerating} className="bg-red-600 hover:bg-red-700" size="sm">
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Gerar PDF
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Share2 className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Dica:</p>
                <p>
                  O PDF será aberto em uma nova janela. Certifique-se de que os popups estão habilitados no seu
                  navegador.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
