"use client"

import { Bot, Shield, FileText, BarChart3, ClipboardList } from "lucide-react"

const agents = [
  {
    id: "persona-agent",
    name: "DigitalTwinPersona",
    icon: Bot,
    purpose: "Interactive digital twin representing professional identity",
    capabilities: [
      "Answer questions about skills, projects, and certifications",
      "Provide professional guidance and contact info",
      "Maintain concise, approachable, and informative responses",
    ],
    model: "GPT-4 Turbo",
    temperature: 0.7,
    status: "ACTIVE",
  },
  {
    id: "security-agent",
    name: "SecurityGuardian",
    icon: Shield,
    purpose: "Detects threats and protects the portfolio from malicious inputs",
    capabilities: [
      "Detect SQL injection, XSS, prompt injections, bot attacks",
      "Assign severity (LOW, MEDIUM, HIGH, CRITICAL)",
      "Provide recommended action: ALLOW, BLOCK, CHALLENGE",
    ],
    model: "GPT-4 Turbo",
    temperature: 0.1,
    status: "ACTIVE",
  },
  {
    id: "content-agent",
    name: "ContentCreator",
    icon: FileText,
    purpose: "Generates and manages blog posts and project documentation",
    capabilities: [
      "Create, update, and summarize content in markdown",
      "Maintain consistent branding and technical accuracy",
      "Support MCP tools for automation",
    ],
    model: "GPT-4 Turbo",
    temperature: 0.8,
    status: "STANDBY",
  },
  {
    id: "analytics-agent",
    name: "ThreatAnalytics",
    icon: BarChart3,
    purpose: "Aggregates and analyzes security events for actionable insights",
    capabilities: [
      "Compute threat metrics and trends",
      "Generate dashboards and reports",
      "Predict potential future threats",
    ],
    model: "GPT-4 Turbo",
    temperature: 0.5,
    status: "ACTIVE",
  },
  {
    id: "audit-agent",
    name: "AuditLogger",
    icon: ClipboardList,
    purpose: "Logs and monitors all security-related events",
    capabilities: [
      "Sanitize sensitive data before logging",
      "Store events in Supabase",
      "Send real-time notifications for critical events",
    ],
    model: "System",
    temperature: 0,
    status: "ACTIVE",
  },
]

export function AgentsSection() {
  return (
    <section id="agents" className="py-24 px-6 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-primary font-mono text-sm">AI AGENTS ARCHITECTURE</span>
          <h2 className="text-4xl font-bold text-foreground">
            Intelligent agents working in <span className="text-primary">harmony</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Multiple AI agents collaborate to provide an interactive, secure, and self-defending 
            portfolio experience using the Model Context Protocol (MCP).
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-background border border-border rounded-xl p-6 space-y-4 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <agent.icon className="w-6 h-6 text-primary" />
                </div>
                <span
                  className={`text-xs font-mono px-2 py-1 rounded ${
                    agent.status === "ACTIVE"
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {agent.status}
                </span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
                <p className="text-sm text-muted-foreground">{agent.purpose}</p>
              </div>
              
              <div className="space-y-2">
                <span className="text-xs font-mono text-muted-foreground">CAPABILITIES</span>
                <ul className="space-y-1">
                  {agent.capabilities.map((cap, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">-</span>
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">Model: {agent.model}</span>
                <span className="text-muted-foreground">Temp: {agent.temperature}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
