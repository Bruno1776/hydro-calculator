"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calculator, Play, FileText, Lightbulb, Star } from "lucide-react"
import MathRenderer from "@/components/math-renderer"
import type { CalculationType } from "@/app/page"

interface LearningViewProps {
  calculation: CalculationType
  onBack: () => void
  onToggleMode: () => void
  isLearningMode: boolean
  onMarkModuleComplete: (calculationId: string) => void
  isModuleCompleted: boolean
}

const learningContent = {
  "head-loss": {
    videoId: "dQw4w9WgXcQ",
    theory: `
      <h3>O que é Perda de Carga Localizada?</h3>
      <p>A perda de carga localizada, também conhecida como perda menor, ocorre quando o fluido flui através de conexões, válvulas, curvas e outros componentes de tubulação que causam perturbações no fluxo.</p>
      
      <h3>Por que é Importante?</h3>
      <p>Compreender as perdas de carga localizadas é crucial para:</p>
      <ul>
        <li>Cálculos precisos de pressão do sistema</li>
        <li>Dimensionamento adequado de bombas</li>
        <li>Otimização da eficiência energética</li>
        <li>Validação do projeto do sistema</li>
      </ul>
      
      <h3>Método de Cálculo</h3>
      <p>A perda de carga é calculada usando a fórmula fundamental:</p>
      <div class="formula-container">h_L = K \\times \\frac{V^2}{2g}</div>
      <p>Onde:</p>
      <ul>
        <li><strong>h<sub>L</sub></strong> = Perda de carga (m)</li>
        <li><strong>K</strong> = Coeficiente de perda (adimensional)</li>
        <li><strong>V</strong> = Velocidade do fluido (m/s)</li>
        <li><strong>g</strong> = Aceleração gravitacional (9,81 m/s²)</li>
      </ul>
      
      <h3>Energia Cinética</h3>
      <p>O termo de energia cinética é fundamental:</p>
      <div class="formula-container">\\frac{V^2}{2g} = \\text{Altura de velocidade (m)}</div>
      
      <h3>Relação com Pressão</h3>
      <p>Para converter em perda de pressão:</p>
      <div class="formula-container">\\Delta P = \\rho \\times g \\times h_L</div>
      <p>Onde <strong>ρ</strong> = densidade do fluido (kg/m³)</p>
    `,
    applications: `
      <h3>Aplicações de Campo</h3>
      <p>Este cálculo é essencial em:</p>
      <ul>
        <li><strong>Sistemas de Distribuição de Água:</strong> Calcular perdas de pressão em redes de tubulação</li>
        <li><strong>Sistemas HVAC:</strong> Determinar quedas de pressão em dutos e conexões</li>
        <li><strong>Tubulação Industrial:</strong> Dimensionar bombas e compressores para sistemas de processo</li>
        <li><strong>Proteção contra Incêndio:</strong> Garantir pressão adequada nos aspersores</li>
      </ul>
      
      <h3>Coeficientes de Perda Comuns</h3>
      <div class="coefficients-table">
        <p><strong>Cotovelos:</strong></p>
        <ul>
          <li>Cotovelo 90° (raio longo): K = 0,3-0,5</li>
          <li>Cotovelo 90° (raio curto): K = 0,9-1,0</li>
          <li>Cotovelo 45°: K = 0,2-0,4</li>
        </ul>
        
        <p><strong>Válvulas (totalmente abertas):</strong></p>
        <ul>
          <li>Válvula Gaveta: K = 0,1-0,2</li>
          <li>Válvula Esfera: K = 0,05-0,1</li>
          <li>Válvula Globo: K = 6-10</li>
          <li>Válvula Borboleta: K = 0,2-1,5</li>
        </ul>
      </div>
      
      <h3>Fórmula para Múltiplas Perdas</h3>
      <p>Para sistemas com várias conexões:</p>
      <div class="formula-container">h_{L,total} = \\sum_{i=1}^{n} K_i \\times \\frac{V_i^2}{2g}</div>
    `,
  },
  "pipe-flow": {
    videoId: "dQw4w9WgXcQ",
    theory: `
      <h3>Análise de Fluxo em Tubulações</h3>
      <p>Os cálculos de fluxo em tubulações determinam a vazão de fluido através de tubos circulares sob várias condições.</p>
      
      <h3>Equação Fundamental da Continuidade</h3>
      <p>A vazão volumétrica é dada por:</p>
      <div class="formula-container">Q = A \\times V</div>
      <p>Onde:</p>
      <ul>
        <li><strong>Q</strong> = Vazão volumétrica (m³/s)</li>
        <li><strong>A</strong> = Área da seção transversal (m²)</li>
        <li><strong>V</strong> = Velocidade média (m/s)</li>
      </ul>
      
      <h3>Área da Seção Circular</h3>
      <p>Para tubos circulares:</p>
      <div class="formula-container">A = \\frac{\\pi D^2}{4}</div>
      <p>Onde <strong>D</strong> = diâmetro interno (m)</p>
      
      <h3>Equação Completa</h3>
      <p>Combinando as equações:</p>
      <div class="formula-container">Q = \\frac{\\pi D^2}{4} \\times V</div>
      
      <h3>Velocidades Recomendadas</h3>
      <p>Para diferentes aplicações:</p>
      <ul>
        <li><strong>Água potável:</strong> 0,5 - 2,0 m/s</li>
        <li><strong>Sistemas industriais:</strong> 1,0 - 3,0 m/s</li>
        <li><strong>Linhas de sucção:</strong> 0,5 - 1,5 m/s</li>
        <li><strong>Linhas de recalque:</strong> 1,5 - 3,0 m/s</li>
      </ul>
      
      <h3>Conversões Úteis</h3>
      <p>Relações entre unidades:</p>
      <div class="formula-container">1 \\text{ m}^3\\text{/s} = 1000 \\text{ L/s} = 3600 \\text{ m}^3\\text{/h}</div>
    `,
    applications: `
      <h3>Aplicações Práticas</h3>
      <ul>
        <li><strong>Projeto de sistemas de abastecimento de água:</strong> Dimensionamento de redes de distribuição</li>
        <li><strong>Planejamento de sistemas de irrigação:</strong> Cálculo de vazões para aspersores e gotejadores</li>
        <li><strong>Tubulação de processos industriais:</strong> Transporte de fluidos em plantas químicas</li>
        <li><strong>Projeto de oleodutos e gasodutos:</strong> Transporte de hidrocarbonetos</li>
      </ul>
      
      <h3>Exemplo de Cálculo</h3>
      <p>Para um tubo de 100 mm de diâmetro com velocidade de 2 m/s:</p>
      <div class="formula-container">A = \\frac{\\pi \\times (0,1)^2}{4} = 0,00785 \\text{ m}^2</div>
      <div class="formula-container">Q = 0,00785 \\times 2 = 0,0157 \\text{ m}^3\\text{/s} = 15,7 \\text{ L/s}</div>
    `,
  },
  "pressure-drop": {
    videoId: "dQw4w9WgXcQ",
    theory: `
      <h3>Perda de Pressão por Atrito</h3>
      <p>A perda de pressão por atrito ocorre devido ao atrito entre o fluido e as paredes da tubulação.</p>
      
      <h3>Equação de Darcy-Weisbach</h3>
      <p>A fórmula fundamental para perda de pressão:</p>
      <div class="formula-container">\\Delta P = f \\times \\frac{L}{D} \\times \\frac{\\rho V^2}{2}</div>
      <p>Onde:</p>
      <ul>
        <li><strong>ΔP</strong> = Perda de pressão (Pa)</li>
        <li><strong>f</strong> = Fator de atrito (adimensional)</li>
        <li><strong>L</strong> = Comprimento da tubulação (m)</li>
        <li><strong>D</strong> = Diâmetro interno (m)</li>
        <li><strong>ρ</strong> = Densidade do fluido (kg/m³)</li>
        <li><strong>V</strong> = Velocidade média (m/s)</li>
      </ul>
      
      <h3>Fator de Atrito</h3>
      <p>Para fluxo turbulento em tubos lisos (Blasius):</p>
      <div class="formula-container">f = \\frac{0,316}{Re^{0,25}}</div>
      <p>Para tubos rugosos (Colebrook-White):</p>
      <div class="formula-container">\\frac{1}{\\sqrt{f}} = -2 \\log_{10}\\left(\\frac{\\varepsilon/D}{3,7} + \\frac{2,51}{Re\\sqrt{f}}\\right)</div>
      
      <h3>Conversão para Altura de Coluna</h3>
      <p>Para converter pressão em altura:</p>
      <div class="formula-container">h = \\frac{\\Delta P}{\\rho \\times g}</div>
    `,
    applications: `
      <h3>Aplicações Práticas</h3>
      <ul>
        <li><strong>Dimensionamento de bombas:</strong> Cálculo da altura manométrica total</li>
        <li><strong>Projeto de redes de distribuição:</strong> Garantir pressão adequada nos pontos de consumo</li>
        <li><strong>Sistemas de aquecimento:</strong> Dimensionamento de circuladores</li>
        <li><strong>Processos industriais:</strong> Transporte de fluidos viscosos</li>
      </ul>
    `,
  },
}

const renderContentWithFormulas = (content: string) => {
  const parts = content.split('<div class="formula-container">')

  return parts.map((part, index) => {
    if (index === 0) {
      return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />
    }

    const [formula, ...rest] = part.split("</div>")
    return (
      <div key={index}>
        <div className="my-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 border-l-4 border-novaes-teal rounded-r-lg shadow-sm">
          <MathRenderer formula={formula} className="text-center" />
        </div>
        <div dangerouslySetInnerHTML={{ __html: rest.join("</div>") }} />
      </div>
    )
  })
}

export default function LearningView({
  calculation,
  onBack,
  onToggleMode,
  onMarkModuleComplete,
  isModuleCompleted,
}: LearningViewProps) {
  const content = learningContent[calculation.id as keyof typeof learningContent] || {
    videoId: "dQw4w9WgXcQ",
    theory: "<p>Conteúdo de aprendizado em breve...</p>",
    applications: "<p>Exemplos de aplicação em breve...</p>",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <header className="bg-white shadow-sm border-b border-gray-200/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                size="sm"
                className="hover:bg-novaes-teal/10 hover:text-novaes-teal"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Voltar ao Dashboard</span>
                <span className="sm:hidden">Voltar</span>
              </Button>
              <div className="flex items-center space-x-3">
                <span className="text-xl sm:text-2xl">{calculation.icon}</span>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900">{calculation.title} - Aprendizado</h1>
                  <p className="text-novaes-gray text-sm sm:text-base hidden sm:block">Domine a teoria e aplicações</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={onToggleMode}
              size="sm"
              className="border-novaes-teal text-novaes-teal hover:bg-novaes-teal hover:text-white bg-transparent"
            >
              <Calculator className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Modo Cálculo</span>
              <span className="sm:hidden">Calcular</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs defaultValue="video" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-white/90 backdrop-blur-sm border-2 border-novaes-teal/20 shadow-lg">
            <TabsTrigger
              value="video"
              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-novaes-teal data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-novaes-teal data-[state=inactive]:bg-white data-[state=inactive]:hover:bg-novaes-teal/10 data-[state=inactive]:hover:text-novaes-teal-dark"
            >
              <Play className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Vídeo</span>
            </TabsTrigger>
            <TabsTrigger
              value="theory"
              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-novaes-teal data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-novaes-teal data-[state=inactive]:bg-white data-[state=inactive]:hover:bg-novaes-teal/10 data-[state=inactive]:hover:text-novaes-teal-dark"
            >
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Teoria</span>
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-novaes-teal data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-novaes-teal data-[state=inactive]:bg-white data-[state=inactive]:hover:bg-novaes-teal/10 data-[state=inactive]:hover:text-novaes-teal-dark"
            >
              <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Aplicações</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-novaes-teal">Tutorial em Vídeo</CardTitle>
                <CardDescription className="text-sm sm:text-base text-novaes-gray">
                  Assista a este tutorial abrangente para entender {calculation.title.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
                  <div className="text-center space-y-4">
                    <Play className="w-12 h-12 sm:w-16 sm:h-16 text-novaes-teal mx-auto" />
                    <p className="text-novaes-gray text-sm sm:text-base">Vídeo educacional para {calculation.title}</p>
                    <p className="text-xs sm:text-sm text-gray-500">ID do Vídeo: {content.videoId}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-novaes-teal text-novaes-teal hover:bg-novaes-teal hover:text-white bg-transparent"
                    >
                      <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Reproduzir Vídeo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theory">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader className="bg-novaes-gradient-subtle">
                <CardTitle className="text-lg sm:text-xl text-novaes-teal">Fundamentos Teóricos</CardTitle>
                <CardDescription className="text-sm sm:text-base text-novaes-gray">
                  Compreenda os princípios fundamentais por trás de {calculation.title.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-sm sm:prose max-w-none">{renderContentWithFormulas(content.theory)}</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader className="bg-novaes-gradient-subtle">
                <CardTitle className="text-lg sm:text-xl text-novaes-teal">Aplicações do Mundo Real</CardTitle>
                <CardDescription className="text-sm sm:text-base text-novaes-gray">
                  Aprenda como aplicar {calculation.title.toLowerCase()} na prática de engenharia
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-sm sm:prose max-w-none">
                  {renderContentWithFormulas(content.applications)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {!isModuleCompleted && (
          <div className="mt-8 text-center">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Concluir Módulo</h3>
                <p className="text-novaes-gray text-sm mb-4">
                  Marque este módulo como concluído para progredir em suas certificações
                </p>
                <Button
                  onClick={() => onMarkModuleComplete(calculation.id)}
                  className="bg-novaes-teal hover:bg-novaes-teal-dark"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Marcar como Concluído
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {isModuleCompleted && (
          <div className="mt-8 text-center">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-semibold">Módulo Concluído!</span>
                </div>
                <p className="text-green-600 text-sm mt-2">Parabéns! Você completou este módulo de aprendizado.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
