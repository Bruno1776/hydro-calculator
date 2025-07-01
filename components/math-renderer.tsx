"use client"

import { useEffect, useState } from "react"

interface MathRendererProps {
  formula: string
  className?: string
  inline?: boolean
}

export default function MathRenderer({ formula, className = "", inline = false }: MathRendererProps) {
  const [renderedMath, setRenderedMath] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const renderMath = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const katex = await import("katex")

        // Load KaTeX CSS
        if (typeof document !== "undefined" && !document.querySelector('link[href*="katex"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          document.head.appendChild(link)
        }

        const html = katex.default.renderToString(formula, {
          displayMode: !inline,
          throwOnError: false,
          strict: false,
        })

        setRenderedMath(html)
        setError("")
      } catch (err) {
        console.error("KaTeX rendering error:", err)
        setError(formula) // Fallback to plain text
      }
    }

    if (formula) {
      renderMath()
    }
  }, [formula, inline])

  if (error) {
    return <span className={className}>{error}</span>
  }

  return <span className={className} dangerouslySetInnerHTML={{ __html: renderedMath }} />
}

// Named export for compatibility
export { MathRenderer }
