"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { Bot, Send, X, Minimize2, Maximize2, Shield, Loader2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  threatDetected?: boolean
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Hello! I'm the Digital Twin AI assistant for the DigitalMind Team. I can answer questions about our cybersecurity portfolio, skills, projects, and team members. How can I help you today?",
    timestamp: new Date(),
  },
]

const sampleResponses: Record<string, string> = {
  skills: "The DigitalMind team specializes in:\n\n- **Cybersecurity**: Threat detection, OWASP compliance, WAF implementation\n- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS\n- **Backend**: Node.js, Supabase (PostgreSQL), API security\n- **AI/ML**: OpenAI GPT integration, MCP servers, AI agents\n- **DevOps**: Vercel deployment, CI/CD, security automation",
  projects: "Our main project is the **Digital Twin III - Cyber-Hardened Portfolio**:\n\n- Real-time threat detection and blocking\n- AI-powered conversational agents\n- Security monitoring dashboard\n- Audit logging and compliance\n- MCP server architecture for tool orchestration\n\nVisit our GitHub: github.com/ashmin7/digital-twin-DigitalMind",
  team: "**The DigitalMind Team:**\n\n1. **Ashmin Aryal** - Team Lead / STAR File Author\n2. **Victor Kamanja** - Frontend Developer / PRD Author\n3. **Phuntshok Wangdruk** - Backend / AI Agents Developer\n\nWe collaborate using GitHub, ClickUp, and AI-assisted development tools.",
  security: "Our security architecture includes:\n\n- **WAF Protection**: Vercel WAF with bot detection\n- **Input Validation**: Zod schemas for all inputs\n- **Rate Limiting**: Per-IP/user limits via Upstash Redis\n- **Threat Detection**: SQL injection, XSS, prompt injection detection\n- **Audit Logging**: All security events logged to Supabase\n- **RBAC**: Role-based access control via Clerk",
  agents: "We have 5 AI agents working together:\n\n1. **DigitalTwinPersona**: Interactive chatbot (this one!)\n2. **SecurityGuardian**: Threat detection and blocking\n3. **ContentCreator**: Blog and documentation management\n4. **ThreatAnalytics**: Security metrics and predictions\n5. **AuditLogger**: Event logging and notifications",
  contact: "You can reach the DigitalMind team through:\n\n- **GitHub**: github.com/ashmin7/digital-twin-DigitalMind\n- **Project Repository**: Open issues or discussions\n- **Email**: Contact through the repository",
  default: "I can help you with information about:\n\n- Our **skills** and expertise\n- **Projects** we've built\n- **Team** members and their roles\n- **Security** architecture\n- **AI agents** in the system\n\nWhat would you like to know more about?",
}

function getResponse(input: string): string {
  const lowered = input.toLowerCase()
  
  if (lowered.includes("skill") || lowered.includes("expertise") || lowered.includes("technology") || lowered.includes("tech stack")) {
    return sampleResponses.skills
  }
  if (lowered.includes("project") || lowered.includes("portfolio") || lowered.includes("built") || lowered.includes("work")) {
    return sampleResponses.projects
  }
  if (lowered.includes("team") || lowered.includes("member") || lowered.includes("who") || lowered.includes("ashmin") || lowered.includes("victor") || lowered.includes("phuntshok")) {
    return sampleResponses.team
  }
  if (lowered.includes("security") || lowered.includes("threat") || lowered.includes("protect") || lowered.includes("owasp") || lowered.includes("waf")) {
    return sampleResponses.security
  }
  if (lowered.includes("agent") || lowered.includes("ai") || lowered.includes("bot") || lowered.includes("mcp")) {
    return sampleResponses.agents
  }
  if (lowered.includes("contact") || lowered.includes("reach") || lowered.includes("email") || lowered.includes("connect")) {
    return sampleResponses.contact
  }
  if (lowered.includes("hello") || lowered.includes("hi") || lowered.includes("hey")) {
    return "Hello! Welcome to the Digital Twin III portfolio. I'm here to assist you with any questions about our cybersecurity projects and team. What would you like to know?"
  }
  if (lowered.includes("thank")) {
    return "You're welcome! Feel free to explore the portfolio and reach out if you have more questions. Good luck with your cybersecurity journey!"
  }
  
  return sampleResponses.default
}

function detectThreat(input: string): boolean {
  const sqlPatterns = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|WHERE|FROM)\b.*\b(FROM|INTO|SET|TABLE|WHERE)\b)|('.*--)|(\bOR\b.*=.*\bOR\b)/i
  const xssPatterns = /<script|javascript:|on\w+\s*=|<img.*onerror/i
  const promptInjection = /ignore.*previous|forget.*instructions|system.*prompt|reveal.*secret/i
  
  return sqlPatterns.test(input) || xssPatterns.test(input) || promptInjection.test(input)
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    const threatDetected = detectThreat(input)
    
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate response delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let responseContent: string
    if (threatDetected) {
      responseContent = "**SECURITY ALERT**: Potential malicious input detected. This attempt has been logged by the SecurityGuardian agent.\n\nI'm designed to help with legitimate questions about the DigitalMind portfolio. Please ask a genuine question about our projects, team, or capabilities."
    } else {
      responseContent = getResponse(userMessage.content)
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseContent,
      timestamp: new Date(),
      threatDetected,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all glow-cyan"
        aria-label="Open chat"
      >
        <Bot className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div
      id="chat"
      className={`fixed bottom-6 right-6 z-50 bg-card border border-border rounded-xl shadow-2xl transition-all ${
        isMinimized ? "w-80 h-14" : "w-96 h-[600px] max-h-[80vh]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Digital Twin AI</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-130px)]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : message.threatDetected
                      ? "bg-destructive/10 border border-destructive/30 text-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.threatDetected && (
                    <div className="flex items-center gap-2 mb-2 text-destructive text-xs font-mono">
                      <Shield className="w-4 h-4" />
                      THREAT DETECTED
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
                placeholder="Ask about skills, projects, or security..."
                className="flex-1 bg-input border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
