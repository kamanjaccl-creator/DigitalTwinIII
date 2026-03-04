"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Shield, AlertTriangle, Ban, Activity, TrendingUp, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SecurityMetric {
  label: string
  value: string | number
  change?: string
  icon: typeof Shield
  color: string
}

interface ThreatEvent {
  id: string
  type: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  ip: string
  timestamp: Date
  action: "BLOCKED" | "CHALLENGED" | "LOGGED"
}

const severityColors = {
  LOW: "text-primary",
  MEDIUM: "text-yellow-500",
  HIGH: "text-orange-500",
  CRITICAL: "text-destructive",
}

const severityBg = {
  LOW: "bg-primary/10",
  MEDIUM: "bg-yellow-500/10",
  HIGH: "bg-orange-500/10",
  CRITICAL: "bg-destructive/10",
}

export function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetric[]>([
    { label: "Threats Blocked", value: 0, change: "+12%", icon: Ban, color: "text-destructive" },
    { label: "Active Sessions", value: 0, icon: Activity, color: "text-primary" },
    { label: "Security Score", value: "A+", icon: Shield, color: "text-primary" },
    { label: "Uptime", value: "99.9%", icon: TrendingUp, color: "text-primary" },
  ])

  const [events, setEvents] = useState<ThreatEvent[]>([])
  const [liveTime, setLiveTime] = useState("")

  useEffect(() => {
    // Simulate real-time metrics
    setMetrics([
      { label: "Threats Blocked", value: Math.floor(Math.random() * 150) + 50, change: "+12%", icon: Ban, color: "text-destructive" },
      { label: "Active Sessions", value: Math.floor(Math.random() * 500) + 100, icon: Activity, color: "text-primary" },
      { label: "Security Score", value: "A+", icon: Shield, color: "text-primary" },
      { label: "Uptime", value: "99.9%", icon: TrendingUp, color: "text-primary" },
    ])

    // Generate sample threat events
    const sampleEvents: ThreatEvent[] = [
      { id: "1", type: "SQL_INJECTION", severity: "HIGH", ip: "192.168.1.45", timestamp: new Date(Date.now() - 60000), action: "BLOCKED" },
      { id: "2", type: "XSS_ATTEMPT", severity: "MEDIUM", ip: "10.0.0.123", timestamp: new Date(Date.now() - 120000), action: "BLOCKED" },
      { id: "3", type: "BOT_TRAFFIC", severity: "LOW", ip: "172.16.0.89", timestamp: new Date(Date.now() - 180000), action: "CHALLENGED" },
      { id: "4", type: "BRUTE_FORCE", severity: "CRITICAL", ip: "203.0.113.42", timestamp: new Date(Date.now() - 240000), action: "BLOCKED" },
      { id: "5", type: "PROMPT_INJECTION", severity: "HIGH", ip: "198.51.100.7", timestamp: new Date(Date.now() - 300000), action: "BLOCKED" },
    ]
    setEvents(sampleEvents)

    // Update live time
    const interval = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-24 px-6 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-primary font-mono text-sm">SECURITY OPERATIONS</span>
          <h2 className="text-4xl font-bold text-foreground">
            Real-time <span className="text-primary">threat monitoring</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Live security dashboard showing detected threats, blocked attacks, and system health metrics.
          </p>
          <Link href="/dashboard">
            <Button className="mt-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Shield className="w-4 h-4" />
              Open Full Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Metrics grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-background border border-border rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                {metric.change && (
                  <span className="text-xs font-mono text-primary">{metric.change}</span>
                )}
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Threat events table */}
        <div className="bg-background border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Recent Security Events</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{liveTime}</span>
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse ml-2" />
              <span>LIVE</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-xs font-mono text-muted-foreground">
                  <th className="text-left p-4">TYPE</th>
                  <th className="text-left p-4">SEVERITY</th>
                  <th className="text-left p-4">SOURCE IP</th>
                  <th className="text-left p-4">TIMESTAMP</th>
                  <th className="text-left p-4">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-mono text-sm text-foreground">{event.type}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-mono ${severityBg[event.severity]} ${severityColors[event.severity]}`}>
                        {event.severity}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-sm text-muted-foreground">{event.ip}</td>
                    <td className="p-4 font-mono text-sm text-muted-foreground">
                      {event.timestamp.toLocaleTimeString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-mono ${
                        event.action === "BLOCKED" 
                          ? "bg-destructive/10 text-destructive" 
                          : event.action === "CHALLENGED"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {event.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-mono">
              Showing {events.length} most recent events. All events are logged to Supabase for audit compliance.
            </p>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                View Full Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
