"use client"

import { Code, Database, Lock, Cloud, Cpu, Globe } from "lucide-react"

const techStack = [
  { icon: Code, label: "Next.js 16", description: "React Framework" },
  { icon: Database, label: "Supabase", description: "PostgreSQL + Auth" },
  { icon: Lock, label: "Clerk", description: "Authentication" },
  { icon: Cloud, label: "Vercel", description: "Edge Deployment" },
  { icon: Cpu, label: "OpenAI", description: "AI Integration" },
  { icon: Globe, label: "WAF", description: "Web Security" },
]

const features = [
  {
    title: "Real-time Threat Detection",
    description: "Detects SQL injection, XSS, prompt injection, and bot attacks in real-time with severity classification.",
  },
  {
    title: "AI-Driven Interactions",
    description: "Conversational persona agent answers questions about skills, experience, and portfolio content.",
  },
  {
    title: "Security Dashboard",
    description: "Visualizes attack patterns, blocked threats, and system performance with real-time updates.",
  },
  {
    title: "Audit Logging",
    description: "All security events are logged for transparency, accountability, and compliance.",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left column - About text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-mono text-sm">ABOUT THE PROJECT</span>
              <h2 className="text-4xl font-bold text-foreground">
                Transforming portfolios into{" "}
                <span className="text-primary">cyber-resilient</span> assets
              </h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The Digital Twin III project demonstrates a professional portfolio that is both 
                visually appealing and cyber-resilient. It detects and blocks real cyber threats 
                in real-time while analyzing attacker behavior and generating actionable insights.
              </p>
              <p>
                Built with enterprise-level security controls aligned with OWASP Top 10 best practices,
                this portfolio serves as a showcase of cybersecurity expertise and modern web development.
              </p>
            </div>
            
            {/* Tech stack */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              {techStack.map((tech) => (
                <div
                  key={tech.label}
                  className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <tech.icon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{tech.label}</p>
                    <p className="text-xs text-muted-foreground">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right column - Features */}
          <div className="space-y-6">
            <span className="text-primary font-mono text-sm">KEY FEATURES</span>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-primary font-mono text-sm opacity-50">
                      0{index + 1}
                    </span>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
