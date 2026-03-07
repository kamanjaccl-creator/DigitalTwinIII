"use client"

import { ExternalLink, Github, Shield, Cpu, Database, Server } from "lucide-react"

const projects = [
  {
    title: "Portfolio Hardening System",
    description: "Cyber-hardened portfolio with AI agents and real-time security monitoring. Implements OWASP Top 10 best practices with multi-layer defense architecture.",
    technologies: ["Next.js 16", "TypeScript", "Supabase", "Clerk", "Vercel"],
    features: [
      "Real-time threat detection",
      "AI-powered chatbot",
      "Security dashboard",
      "Audit logging",
    ],
    githubUrl: "https://github.com/ashmin7/digital-twin-DigitalMind",
    icon: Shield,
  },
  {
    title: "MCP Server Architecture",
    description: "Model Context Protocol implementation enabling AI agents to interact with external tools, databases, and services with secure tool calling.",
    technologies: ["TypeScript", "OpenAI", "Supabase", "Node.js"],
    features: [
      "Security Monitor Server",
      "Content Manager Server",
      "Threat Intelligence Server",
      "Tool orchestration",
    ],
    githubUrl: "https://github.com/ashmin7/digital-twin-DigitalMind",
    icon: Cpu,
  },
  {
    title: "Security Event Pipeline",
    description: "Structured logging and event pipeline for capturing, analyzing, and responding to security threats with real-time notifications.",
    technologies: ["PostgreSQL", "Supabase Realtime", "Zod", "Redis"],
    features: [
      "Event classification",
      "Severity scoring",
      "IP reputation checks",
      "Automated blocking",
    ],
    githubUrl: "https://github.com/ashmin7/digital-twin-DigitalMind",
    icon: Database,
  },
  {
    title: "Threat Detection API",
    description: "Multi-layer API security with rate limiting, WAF integration, input validation, and bot detection using Arcjet and custom middleware.",
    technologies: ["Next.js API", "Arcjet", "Upstash Redis", "Zod"],
    features: [
      "SQL injection detection",
      "XSS prevention",
      "Rate limiting",
      "Bot mitigation",
    ],
    githubUrl: "https://github.com/ashmin7/digital-twin-DigitalMind",
    icon: Server,
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-primary font-mono text-sm">PROJECTS</span>
          <h2 className="text-4xl font-bold text-foreground">
            Building <span className="text-primary">secure</span> systems
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each component of the Digital Twin III project demonstrates enterprise-level 
            security practices and modern development techniques.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <project.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="View source code"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="View live demo"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <span className="text-xs font-mono text-muted-foreground">KEY FEATURES</span>
                  <div className="grid grid-cols-2 gap-2">
                    {project.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-muted/30 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs font-mono bg-background border border-border rounded text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
