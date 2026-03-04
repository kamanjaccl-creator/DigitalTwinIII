"use client"

import { useEffect, useState } from "react"
import { Shield, Terminal, Activity, Lock } from "lucide-react"

export function Hero() {
  const [currentTime, setCurrentTime] = useState("")
  const [statusOnline, setStatusOnline] = useState(0)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    // Simulate online count
    setStatusOnline(Math.floor(Math.random() * 500) + 100)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center cyber-grid overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Main content */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-primary font-mono text-sm">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>SYSTEM ACTIVE</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-balance">
              <span className="text-foreground">Digital Twin III</span>
              <br />
              <span className="text-primary">Cyber-Hardened</span>
              <br />
              <span className="text-muted-foreground">Portfolio</span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              A cyber-secured, monitored, and attack-resilient digital asset demonstrating 
              real-world threat defense capabilities with integrated AI agents.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors glow-cyan"
              >
                <Shield className="w-4 h-4" />
                View Projects
              </a>
              <a
                href="#chat"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                <Terminal className="w-4 h-4" />
                Talk to Digital Twin
              </a>
            </div>
          </div>
          
          {/* Right side - Status panel */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6 font-mono text-sm">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-muted-foreground">DIGITALMIND TEAM</span>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-primary">ONLINE</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">STATUS</span>
                <p className="text-foreground">OPERATIONAL</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">ACCESS LEVEL</span>
                <p className="text-foreground">PUBLIC</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">VISITORS</span>
                <p className="text-foreground">{statusOnline.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">TIME</span>
                <p className="text-foreground">{currentTime}</p>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Threat Detection</span>
                <span className="ml-auto text-primary">ACTIVE</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">WAF Protection</span>
                <span className="ml-auto text-primary">ENABLED</span>
              </div>
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">AI Agents</span>
                <span className="ml-auto text-primary">5 ONLINE</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Recording in progress
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
