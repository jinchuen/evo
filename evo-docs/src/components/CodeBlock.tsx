import { useState } from 'react'

interface CodeBlockProps {
  code: string
  lang?: string
}

export function CodeBlock({ code, lang = 'tsx' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="docs-code-block">
      <div className="docs-code-header">
        <span className="docs-code-lang">{lang}</span>
        <button className="docs-code-copy" onClick={copy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="docs-code-content">{code}</pre>
    </div>
  )
}
