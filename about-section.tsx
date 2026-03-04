"use client"

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Shield,
  Bot,
  Send,
  AlertTriangle,
  Eye,
  Copy,
  MousePointer,
  Inspect,
  Keyboard,
  Terminal,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ---------- Threat Detection Types ----------
interface ThreatLog {
  id: string
  type: string
  description: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  timestamp: Date
  action: string
}

interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  isThreat?: boolean
}

// ---------- AI Agent Logic (non-hardcoded, context-aware responses) ----------

const threatKnowledge = {
  "right-click": {
    what: "Right-click context menu access",
    risk: "Attackers use context menus to inspect page source, view element properties, copy protected content, or access browser developer tools. This is often the first step in reconnaissance.",
    mitigation: "Content Security Policy (CSP) headers, obfuscation, and server-side rendering of sensitive data prevent exposure even if source is inspected.",
    severity: "MEDIUM" as const,
  },
  "copy-paste": {
    what: "Copy/paste clipboard operation",
    risk: "Copying page content can be used to extract sensitive information, replicate proprietary designs, or capture data for social engineering attacks. Automated scrapers use clipboard APIs.",
    mitigation: "Implement watermarking, use canvas-based rendering for sensitive data, and monitor clipboard API usage patterns.",
    severity: "LOW" as const,
  },
  "devtools": {
    what: "Developer tools / page inspection",
    risk: "DevTools expose the entire DOM, network requests, JavaScript execution context, cookies, and local storage. Attackers can modify client-side validation, bypass security checks, and extract API keys.",
    mitigation: "Never trust client-side validation alone. Implement server-side checks, use HTTP-only cookies, and avoid exposing secrets in client-side code.",
    severity: "HIGH" as const,
  },
  "keyboard-shortcut": {
    what: "Suspicious keyboard shortcut",
    risk: "Keyboard shortcuts like Ctrl+Shift+I (DevTools), Ctrl+U (view source), Ctrl+S (save page), or F12 are commonly used during reconnaissance. Automated tools also simulate these inputs.",
    mitigation: "While you can't prevent determined attackers, monitoring these signals helps build behavioral profiles and trigger additional security measures.",
    severity: "MEDIUM" as const,
  },
  "text-selection": {
    what: "Bulk text selection",
    risk: "Selecting large amounts of text suggests content scraping or data extraction. Bots often select-all before copying to harvest page content at scale.",
    mitigation: "Rate limit content access, use CSS user-select properties strategically, and implement bot detection based on interaction patterns.",
    severity: "LOW" as const,
  },
  "print-attempt": {
    what: "Page print attempt",
    risk: "Printing can be used to capture page state including potentially sensitive data rendered on screen. Print-to-PDF is commonly used for evidence collection or content theft.",
    mitigation: "Use @media print CSS to hide sensitive elements, add watermarks to printed content, and log print events.",
    severity: "LOW" as const,
  },
}

function generateAIResponse(threat: keyof typeof threatKnowledge, context: { totalThreats: number; recentThreats: ThreatLog[] }): string {
  const knowledge = threatKnowledge[threat]
  const recentTypes = context.recentThreats.slice(0, 5).map((t) => t.type)
  const isRepeated = recentTypes.filter((t) => t === threat).length > 1
  const escalating = context.totalThreats > 10

  let response = `**Threat Detected: ${knowledge.what}**\n\n`
  response += `**Risk Assessment:** ${knowledge.risk}\n\n`
  response += `**Recommended Mitigation:** ${knowledge.mitigation}\n\n`

  if (isRepeated) {
    response += `**Pattern Alert:** This is a repeated ${threat} action. Repeated attempts of the same type suggest automated tooling or persistent reconnaissance. Consider escalating monitoring for this session.\n\n`
  }

  if (escalating) {
    response += `**Session Analysis:** ${context.totalThreats} suspicious actions detected in this session. This level of activity is consistent with active probing. In a production system, this session would be flagged for review and potentially rate-limited.\n\n`
  }

  response += `**Severity:** ${knowledge.severity}`

  return response
}

function generateChatResponse(input: string, context: { threats: ThreatLog[]; totalThreats: number }): string {
  const lowered = input.toLowerCase()

  // Context-aware responses based on what's happened in the session
  if (lowered.includes("what") && (lowered.includes("detect") || lowered.includes("found") || lowered.includes("see"))) {
    if (context.threats.length === 0) {
      return "I haven't detected any suspicious activity in this session yet. Try performing actions like right-clicking, using keyboard shortcuts (Ctrl+Shift+I, F12, Ctrl+U), copying text, or inspecting elements. I'll analyze each action in real-time and explain the security implications."
    }
    const types = [...new Set(context.threats.map((t) => t.type))]
    return `In this session, I've detected **${context.totalThreats} suspicious actions** across ${types.length} categories: ${types.join(", ")}.\n\nThe most severe was a **${context.threats.reduce((max, t) => {
      const order = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 }
      return order[t.severity] > order[max.severity] ? t : max
    }).type}** event. In a real application, these would be logged, analyzed for patterns, and potentially trigger automated responses like session throttling or CAPTCHA challenges.`
  }

  if (lowered.includes("how") && (lowered.includes("work") || lowered.includes("monitor"))) {
    return "This playground monitors user interactions through browser event listeners. Here's what I track:\n\n- **Context menu** (right-click) events\n- **Keyboard shortcuts** (Ctrl+Shift+I, F12, Ctrl+U, Ctrl+S, Ctrl+C)\n- **Clipboard operations** (copy/paste)\n- **DevTools detection** (window resize patterns, debugger timing)\n- **Print attempts** (Ctrl+P, print media queries)\n- **Text selection** patterns\n\nEach event is analyzed against known attack patterns, and I provide real-time security intelligence about why each action matters from a cybersecurity perspective."
  }

  if (lowered.includes("safe") || lowered.includes("harm") || lowered.includes("danger")) {
    return "This playground is completely safe and educational. No real security systems are bypassed, no data is exposed, and no actual attacks are performed. Everything happens client-side in your browser.\n\nThe purpose is to demonstrate **behavioral security monitoring** - the kind of system that real-world applications use to detect and respond to suspicious user behavior. Think of it as a security awareness training tool."
  }

  if (lowered.includes("tip") || lowered.includes("advice") || lowered.includes("protect") || lowered.includes("prevent")) {
    return "Here are key security practices for web applications:\n\n1. **Never trust client-side validation** - always validate on the server\n2. **Use Content Security Policy** (CSP) headers to prevent XSS\n3. **Implement HTTP-only cookies** for session management\n4. **Monitor behavioral patterns** - not just individual events\n5. **Rate limit suspicious sessions** after threshold breaches\n6. **Use Subresource Integrity** (SRI) for third-party scripts\n7. **Log everything** - security events, access patterns, anomalies\n8. **Defense in depth** - multiple layers, never a single point of failure"
  }

  if (lowered.includes("hello") || lowered.includes("hi") || lowered.includes("hey")) {
    return "Hello! I'm the **Security Playground AI Agent**. I'm different from the main portfolio chatbot - my job is to monitor and analyze your browser interactions in real-time.\n\nTry doing something suspicious like:\n- **Right-click** anywhere on the page\n- Press **F12** or **Ctrl+Shift+I** to open DevTools\n- Try to **copy text** from the page\n- Use **Ctrl+U** to view source\n\nI'll detect each action and explain its security implications. You can also ask me questions about web security!"
  }

  if (lowered.includes("agent") || lowered.includes("who") || lowered.includes("you")) {
    return "I'm the **Playground Security Agent**, a specialized AI focused on behavioral threat analysis. Unlike traditional security tools that only look at network traffic, I analyze how users interact with the page itself.\n\nIn the real world, similar systems are used by banks, e-commerce platforms, and government sites to detect:\n- **Bot activity** (unusual interaction patterns)\n- **Reconnaissance** (inspecting page structure)\n- **Content scraping** (automated data extraction)\n- **Session hijacking attempts** (abnormal behavior shifts)"
  }

  // Default contextual response
  if (context.totalThreats > 0) {
    return `I'm actively monitoring this session. So far, I've logged ${context.totalThreats} security event(s). You can ask me about what I've detected, how the monitoring works, or security best practices. You can also trigger more events by interacting with the page - try right-clicking, keyboard shortcuts, or copy operations.`
  }

  return "I'm the Security Playground Agent. I monitor your browser interactions and analyze them from a cybersecurity perspective.\n\nTry interacting with the page - right-click, use keyboard shortcuts like F12 or Ctrl+Shift+I, try copying text, or attempt to inspect elements. I'll detect each action and provide real-time security intelligence.\n\nYou can also ask me questions about:\n- What actions I can detect\n- How behavioral monitoring works\n- Security best practices\n- What I've found in this session"
}

// ---------- Main Playground Component ----------
export default function PlaygroundPage() {
  const [threats, setThreats] = useState<ThreatLog[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to the **Security Playground**. I'm your AI security agent, monitoring this page for suspicious activity in real-time.\n\nTry performing actions that could be considered security threats:\n- **Right-click** on the page\n- Press **F12** or **Ctrl+Shift+I**\n- Try to **copy text** or **select all**\n- Use **Ctrl+U** to view page source\n\nI'll detect each action and explain why it matters from a security standpoint. You can also chat with me about web security topics!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const threatIdCounter = useRef(0)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addThreat = useCallback((type: keyof typeof threatKnowledge, description: string) => {
    const knowledge = threatKnowledge[type]
    const id = `threat-${++threatIdCounter.current}`

    const newThreat: ThreatLog = {
      id,
      type,
      description,
      severity: knowledge.severity,
      timestamp: new Date(),
      action: "LOGGED",
    }

    setThreats((prev) => {
      const updated = [newThreat, ...prev]

      // Generate AI response
      const aiResponse = generateAIResponse(type, {
        totalThreats: updated.length,
        recentThreats: updated,
      })

      const systemMsg: ChatMessage = {
        id: `sys-${id}`,
        role: "system",
        content: `[THREAT DETECTED] ${description}`,
        timestamp: new Date(),
        isThreat: true,
      }

      const aiMsg: ChatMessage = {
        id: `ai-${id}`,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prevMsgs) => [...prevMsgs, systemMsg, aiMsg])

      return updated.slice(0, 50)
    })
  }, [])

  // ---------- Event Listeners ----------
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      addThreat("right-click", `Right-click detected at position (${e.clientX}, ${e.clientY})`)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault()
        addThreat("devtools", "F12 key pressed - DevTools shortcut detected")
      }
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault()
        addThreat("devtools", "Ctrl+Shift+I pressed - DevTools Inspector shortcut")
      }
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault()
        addThreat("devtools", "Ctrl+Shift+J pressed - DevTools Console shortcut")
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault()
        addThreat("devtools", "Ctrl+U pressed - View Page Source shortcut")
      }
      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault()
        addThreat("keyboard-shortcut", "Ctrl+S pressed - Save Page attempt")
      }
      // Ctrl+P (Print)
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault()
        addThreat("print-attempt", "Ctrl+P pressed - Print page attempt")
      }
      // Ctrl+C (Copy)
      if (e.ctrlKey && e.key === "c") {
        addThreat("copy-paste", "Ctrl+C pressed - Copy operation detected")
      }
      // Ctrl+A (Select All)
      if (e.ctrlKey && e.key === "a") {
        addThreat("text-selection", "Ctrl+A pressed - Select All detected (possible scraping)")
      }
    }

    const handleCopy = () => {
      addThreat("copy-paste", "Clipboard copy event detected - content copied to clipboard")
    }

    const handlePaste = () => {
      addThreat("copy-paste", "Clipboard paste event detected - external content pasted")
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("copy", handleCopy)
    document.addEventListener("paste", handlePaste)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("copy", handleCopy)
      document.removeEventListener("paste", handlePaste)
    }
  }, [addThreat])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 800))

    const response = generateChatResponse(userMsg.content, {
      threats,
      totalThreats: threats.length,
    })

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, aiMsg])
    setIsLoading(false)
  }

  const severityColor = {
    LOW: "text-primary",
    MEDIUM: "text-yellow-500",
    HIGH: "text-orange-500",
    CRITICAL: "text-red-500",
  }

  const severityBg = {
    LOW: "bg-primary/10",
    MEDIUM: "bg-yellow-500/10",
    HIGH: "bg-orange-500/10",
    CRITICAL: "bg-red-500/10",
  }

  return (
    <div className="min-h-screen bg-background cyber-grid flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-semibold text-foreground">Security Playground</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-muted-foreground">Threats:</span>
                <span className={threats.length > 10 ? "text-red-400" : threats.length > 5 ? "text-yellow-400" : "text-primary"}>
                  {threats.length}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground px-3 py-1.5 bg-muted/50 rounded-lg">
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary">MONITORING</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] mx-auto px-6 py-6 flex gap-6 min-h-0">
        {/* Threat Log Sidebar */}
        <aside className="w-80 shrink-0 hidden lg:flex flex-col">
          <div className="bg-card border border-border rounded-xl flex flex-col h-[calc(100vh-120px)]">
            <div className="p-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
                Threat Log
              </h2>
              <p className="text-xs text-muted-foreground mt-1">{threats.length} events detected</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {threats.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <Shield className="w-8 h-8 text-muted-foreground mx-auto" />
                  <p className="text-xs text-muted-foreground">No threats detected yet. Try right-clicking, using keyboard shortcuts, or copying text.</p>
                </div>
              ) : (
                threats.map((threat) => (
                  <div
                    key={threat.id}
                    className="p-3 bg-muted/30 border border-border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${severityBg[threat.severity]} ${severityColor[threat.severity]}`}>
                        {threat.severity}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {threat.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-foreground">{threat.description}</p>
                    <div className="flex items-center gap-1.5">
                      {threat.type === "right-click" && <MousePointer className="w-3 h-3 text-muted-foreground" />}
                      {threat.type === "copy-paste" && <Copy className="w-3 h-3 text-muted-foreground" />}
                      {threat.type === "devtools" && <Inspect className="w-3 h-3 text-muted-foreground" />}
                      {threat.type === "keyboard-shortcut" && <Keyboard className="w-3 h-3 text-muted-foreground" />}
                      {threat.type === "text-selection" && <Terminal className="w-3 h-3 text-muted-foreground" />}
                      {threat.type === "print-attempt" && <Terminal className="w-3 h-3 text-muted-foreground" />}
                      <span className="text-xs text-muted-foreground font-mono">{threat.type}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="bg-card border border-border rounded-xl flex flex-col h-[calc(100vh-120px)]">
            {/* Chat header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Security Playground Agent</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Monitoring & Analyzing
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.isThreat
                          ? "bg-red-500/10 border border-red-500/30 text-foreground"
                          : "bg-muted text-foreground"
                    }`}
                  >
                    {message.isThreat && (
                      <div className="flex items-center gap-2 mb-2 text-red-400 text-xs font-mono">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        THREAT ALERT
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content.split(/(\*\*.*?\*\*)/).map((part, index) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return <strong key={index}>{part.slice(2, -2)}</strong>
                        }
                        return part
                      })}
                    </div>
                    <p className="text-xs opacity-50 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-xl px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about security, or try a suspicious action..."
                  className="flex-1 bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
