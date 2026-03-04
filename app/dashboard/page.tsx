"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Shield,
  AlertTriangle,
  Ban,
  Activity,
  TrendingUp,
  Clock,
  ArrowLeft,
  Filter,
  Download,
  RefreshCw,
  Globe,
  Cpu,
  Database,
  Zap,
  Eye,
  ChevronDown,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface ThreatEvent {
  id: string
  type: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  ip: string
  timestamp: Date
  action: "BLOCKED" | "CHALLENGED" | "LOGGED"
  country: string
  userAgent: string
  payload?: string
}

const severityColors = {
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

const CHART_COLORS = ["#2dd4bf", "#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6"]

// Generate mock data for charts
const generateTimeSeriesData = () => {
  const data = []
  const now = new Date()
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", hour12: false }),
      threats: Math.floor(Math.random() * 50) + 10,
      blocked: Math.floor(Math.random() * 45) + 8,
      requests: Math.floor(Math.random() * 1000) + 500,
    })
  }
  return data
}

const attackTypeData = [
  { name: "SQL Injection", value: 35, color: "#ef4444" },
  { name: "XSS", value: 25, color: "#f59e0b" },
  { name: "Bot Traffic", value: 20, color: "#3b82f6" },
  { name: "Brute Force", value: 12, color: "#8b5cf6" },
  { name: "Other", value: 8, color: "#6b7280" },
]

const geoData = [
  { country: "United States", attacks: 1250, percentage: 32 },
  { country: "China", attacks: 890, percentage: 23 },
  { country: "Russia", attacks: 654, percentage: 17 },
  { country: "Brazil", attacks: 432, percentage: 11 },
  { country: "India", attacks: 321, percentage: 8 },
  { country: "Other", attacks: 350, percentage: 9 },
]

const generateEvents = (): ThreatEvent[] => {
  const types = ["SQL_INJECTION", "XSS_ATTEMPT", "BOT_TRAFFIC", "BRUTE_FORCE", "PROMPT_INJECTION", "PATH_TRAVERSAL", "CSRF_ATTEMPT"]
  const severities: ThreatEvent["severity"][] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
  const actions: ThreatEvent["action"][] = ["BLOCKED", "CHALLENGED", "LOGGED"]
  const countries = ["US", "CN", "RU", "BR", "IN", "DE", "UK", "FR"]
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `evt-${1000 + i}`,
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000),
    action: actions[Math.floor(Math.random() * actions.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    payload: Math.random() > 0.5 ? "SELECT * FROM users WHERE 1=1--" : undefined,
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// Attack points on world map (approximate x,y positions on SVG map)
const attackNodes = [
  { id: "us", label: "United States", x: 22, y: 38, attacks: 1250, color: "#ef4444" },
  { id: "cn", label: "China", x: 78, y: 40, attacks: 890, color: "#f59e0b" },
  { id: "ru", label: "Russia", x: 68, y: 28, attacks: 654, color: "#ef4444" },
  { id: "br", label: "Brazil", x: 32, y: 62, attacks: 432, color: "#f59e0b" },
  { id: "in", label: "India", x: 72, y: 48, attacks: 321, color: "#3b82f6" },
  { id: "de", label: "Germany", x: 52, y: 32, attacks: 210, color: "#3b82f6" },
  { id: "uk", label: "UK", x: 48, y: 30, attacks: 185, color: "#3b82f6" },
  { id: "au", label: "Australia", x: 85, y: 70, attacks: 120, color: "#2dd4bf" },
  { id: "ng", label: "Nigeria", x: 52, y: 52, attacks: 95, color: "#8b5cf6" },
  { id: "kr", label: "South Korea", x: 82, y: 38, attacks: 88, color: "#3b82f6" },
]

// Target: Our server location (Vercel Edge - US East)
const targetNode = { x: 26, y: 34, label: "Portfolio Server" }

function AttackMap() {
  const [activeAttacks, setActiveAttacks] = useState<string[]>([])
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const randomNodes = attackNodes
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 4) + 2)
        .map((n) => n.id)
      setActiveAttacks(randomNodes)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full aspect-[2/1] bg-muted/20 rounded-lg border border-border overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Simplified world continents outline */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Simplified continent shapes */}
        {/* North America */}
        <path d="M10,20 L30,15 L35,25 L30,40 L25,45 L15,40 L10,30 Z" fill="rgba(45,212,191,0.08)" stroke="rgba(45,212,191,0.15)" strokeWidth="0.3" />
        {/* South America */}
        <path d="M25,50 L35,48 L37,55 L35,70 L28,75 L22,65 Z" fill="rgba(45,212,191,0.08)" stroke="rgba(45,212,191,0.15)" strokeWidth="0.3" />
        {/* Europe */}
        <path d="M45,18 L58,15 L60,25 L55,35 L48,32 L44,25 Z" fill="rgba(45,212,191,0.08)" stroke="rgba(45,212,191,0.15)" strokeWidth="0.3" />
        {/* Africa */}
        <path d="M45,38 L58,35 L62,45 L58,65 L50,68 L42,55 Z" fill="rgba(45,212,191,0.08)" stroke="rgba(45,212,191,0.15)" strokeWidth="0.3" />
        {/* Asia */}
        <path d="M60,15 L90,18 L92,35 L85,45 L70,50 L62,40 L58,25 Z" fill="rgba(45,212,191,0.08)" stroke="rgba(45,212,191,0.15)" strokeWidth="0.3" />
        {/* Australia */}
        <path d="M80,60 L92,58 L94,68 L88,72 L80,68 Z" fill="rgba(45,212,191,0.08)" stroke="rgba(45,212,191,0.15)" strokeWidth="0.3" />

        {/* Attack lines */}
        {attackNodes.map((node) => (
          <line
            key={`line-${node.id}`}
            x1={node.x}
            y1={node.y}
            x2={targetNode.x}
            y2={targetNode.y}
            stroke={activeAttacks.includes(node.id) ? node.color : "rgba(45,212,191,0.1)"}
            strokeWidth={activeAttacks.includes(node.id) ? "0.4" : "0.15"}
            strokeDasharray={activeAttacks.includes(node.id) ? "1 0.5" : "0.5 1"}
            opacity={activeAttacks.includes(node.id) ? 0.8 : 0.3}
            className="transition-all duration-500"
          />
        ))}

        {/* Attack source nodes */}
        {attackNodes.map((node) => (
          <g
            key={node.id}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            className="cursor-pointer"
          >
            {activeAttacks.includes(node.id) && (
              <circle
                cx={node.x}
                cy={node.y}
                r="2.5"
                fill="none"
                stroke={node.color}
                strokeWidth="0.2"
                opacity="0.4"
              >
                <animate attributeName="r" from="1.5" to="3.5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r="1"
              fill={activeAttacks.includes(node.id) ? node.color : "rgba(45,212,191,0.5)"}
              filter={activeAttacks.includes(node.id) ? "url(#glow)" : undefined}
              className="transition-all duration-300"
            />
            {hoveredNode === node.id && (
              <g>
                <rect
                  x={node.x + 2}
                  y={node.y - 5}
                  width="18"
                  height="7"
                  rx="1"
                  fill="#18181b"
                  stroke="#27272a"
                  strokeWidth="0.3"
                />
                <text x={node.x + 3} y={node.y - 1.5} fontSize="2.2" fill="#f5f5f5" fontFamily="monospace">
                  {node.label}
                </text>
                <text x={node.x + 3} y={node.y + 1} fontSize="1.8" fill="#2dd4bf" fontFamily="monospace">
                  {node.attacks} attacks
                </text>
              </g>
            )}
          </g>
        ))}

        {/* Target server node */}
        <circle cx={targetNode.x} cy={targetNode.y} r="2" fill="none" stroke="#2dd4bf" strokeWidth="0.3" opacity="0.3">
          <animate attributeName="r" from="2" to="4" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={targetNode.x} cy={targetNode.y} r="1.2" fill="#2dd4bf" filter="url(#glow)" />
        <text x={targetNode.x - 5} y={targetNode.y + 4} fontSize="2" fill="#2dd4bf" fontFamily="monospace" textAnchor="middle">
          PROTECTED
        </text>
      </svg>

      {/* Stats overlay */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3">
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2">
          <p className="text-xs text-muted-foreground">Active Sources</p>
          <p className="text-sm font-bold font-mono text-foreground">{activeAttacks.length}</p>
        </div>
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2">
          <p className="text-xs text-muted-foreground">Total Blocked</p>
          <p className="text-sm font-bold font-mono text-primary">4,245</p>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [timeSeriesData, setTimeSeriesData] = useState<ReturnType<typeof generateTimeSeriesData>>([])
  const [events, setEvents] = useState<ThreatEvent[]>([])
  const [liveTime, setLiveTime] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<ThreatEvent | null>(null)
  const [timeRange, setTimeRange] = useState("24h")
  const [isLoaded, setIsLoaded] = useState(false)

  const metrics = [
    { label: "Total Requests", value: "289K", change: "+12.5%", icon: Activity, color: "text-primary" },
    { label: "Threats Detected", value: "1,247", change: "+8.2%", icon: AlertTriangle, color: "text-yellow-500" },
    { label: "Attacks Blocked", value: "1,189", change: "+15.3%", icon: Ban, color: "text-red-500" },
    { label: "Block Rate", value: "95.3%", change: "+2.1%", icon: Shield, color: "text-primary" },
  ]

  const systemHealth = [
    { label: "WAF Status", value: "Active", icon: Shield, status: "healthy" },
    { label: "API Gateway", value: "Healthy", icon: Zap, status: "healthy" },
    { label: "Database", value: "Connected", icon: Database, status: "healthy" },
    { label: "Edge Network", value: "Optimal", icon: Globe, status: "healthy" },
  ]

  // Initialize random data only on the client to avoid hydration mismatch
  useEffect(() => {
    setTimeSeriesData(generateTimeSeriesData())
    setEvents(generateEvents())
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredEvents = events.filter((event) => {
    const matchesSeverity = selectedSeverity === "ALL" || event.severity === selectedSeverity
    const matchesSearch = event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.ip.includes(searchQuery) ||
      event.country.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSeverity && matchesSearch
  })

  const handleRefresh = () => {
    setTimeSeriesData(generateTimeSeriesData())
    setEvents(generateEvents())
  }

  // Show loading state until client-side data is ready
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background cyber-grid flex items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground font-mono text-sm">Loading security data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Portfolio
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-semibold text-foreground">Security Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground px-3 py-1.5 bg-muted/50 rounded-lg">
                <Clock className="w-3.5 h-3.5" />
                <span>{liveTime}</span>
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-primary">LIVE</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    Last {timeRange}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTimeRange("1h")}>Last 1 hour</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange("6h")}>Last 6 hours</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange("24h")}>Last 24 hours</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange("7d")}>Last 7 days</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        {/* Real-time Threat Monitoring */}
        <div className="bg-card border border-primary/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Real-time Threat Monitoring</h2>
                <p className="text-xs text-muted-foreground font-mono">All systems protected - 5 AI agents active</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary">MONITORING</span>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { label: "SQL Injection", count: 23, status: "blocked" },
              { label: "XSS Attempts", count: 14, status: "blocked" },
              { label: "Brute Force", count: 8, status: "blocked" },
              { label: "Bot Traffic", count: 45, status: "challenged" },
              { label: "Prompt Injection", count: 6, status: "blocked" },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-muted/30 border border-border rounded-lg">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-xl font-bold text-foreground mt-1">{item.count}</p>
                <span className={`text-xs font-mono ${item.status === "blocked" ? "text-red-400" : "text-yellow-400"}`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-card border border-border rounded-xl p-5 space-y-3 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {metric.change}
                </span>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Traffic & Threats Over Time */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-foreground">Traffic & Threats</h3>
                <p className="text-sm text-muted-foreground">Request volume and threat detection over time</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span className="text-muted-foreground">Threats</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-muted-foreground">Blocked</span>
                </div>
              </div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="threats"
                    stroke="#2dd4bf"
                    fill="url(#threatGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="blocked"
                    stroke="#ef4444"
                    fill="url(#blockedGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attack Type Distribution */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-foreground">Attack Types</h3>
              <p className="text-sm text-muted-foreground">Distribution by category</p>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attackTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {attackTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {attackTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-mono text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Geographic & System Health Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Geographic Distribution */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-foreground">Attack Origins</h3>
                <p className="text-sm text-muted-foreground">Geographic distribution of detected threats</p>
              </div>
              <Globe className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={geoData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                  <XAxis type="number" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis dataKey="country" type="category" stroke="#71717a" fontSize={11} tickLine={false} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value} attacks`, "Count"]}
                  />
                  <Bar dataKey="attacks" fill="#2dd4bf" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-foreground">System Health</h3>
              <p className="text-sm text-muted-foreground">Infrastructure status</p>
            </div>
            <div className="space-y-4">
              {systemHealth.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary">{item.value}</span>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 border border-primary/30 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">AI Agents Active</span>
              </div>
              <p className="text-xs text-muted-foreground">
                5 security agents monitoring traffic in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Event Log */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Security Event Log</h3>
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                {filteredEvents.length} events
              </span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-[200px] h-9 bg-muted/50"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Filter className="w-4 h-4" />
                    {selectedSeverity === "ALL" ? "All" : selectedSeverity}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedSeverity("ALL")}>All Severities</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedSeverity("CRITICAL")}>Critical</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedSeverity("HIGH")}>High</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedSeverity("MEDIUM")}>Medium</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedSeverity("LOW")}>Low</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-muted/30 sticky top-0">
                <tr className="text-xs font-mono text-muted-foreground">
                  <th className="text-left p-4">ID</th>
                  <th className="text-left p-4">TYPE</th>
                  <th className="text-left p-4">SEVERITY</th>
                  <th className="text-left p-4">SOURCE</th>
                  <th className="text-left p-4">COUNTRY</th>
                  <th className="text-left p-4">TIMESTAMP</th>
                  <th className="text-left p-4">ACTION</th>
                  <th className="text-left p-4">DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <td className="p-4 font-mono text-xs text-muted-foreground">{event.id}</td>
                    <td className="p-4 font-mono text-sm text-foreground">{event.type}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-mono ${severityBg[event.severity]} ${severityColors[event.severity]}`}
                      >
                        {event.severity}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-sm text-muted-foreground">{event.ip}</td>
                    <td className="p-4 font-mono text-sm text-muted-foreground">{event.country}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">
                      {event.timestamp.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-mono ${
                          event.action === "BLOCKED"
                            ? "bg-red-500/10 text-red-500"
                            : event.action === "CHALLENGED"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {event.action}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Threat Patterns Section */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Threat Pattern Analysis</h3>
              <p className="text-sm text-muted-foreground">Identified attack patterns from recent events</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5" />
              3 ACTIVE PATTERNS
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                name: "Coordinated SQL Injection",
                description: "Multiple IPs from the same /24 subnet attempting SQL injection with similar payloads. Targeting login and search endpoints.",
                ips: 12,
                severity: "CRITICAL" as const,
                firstSeen: "2h ago",
                pattern: "Sequential scanning from 203.0.113.0/24",
                techniques: ["UNION-based injection", "Time-based blind SQLi", "Error-based extraction"],
              },
              {
                name: "XSS Spray Campaign",
                description: "Automated XSS payload delivery across all input fields. Rotating user agents suggest bot network involvement.",
                ips: 34,
                severity: "HIGH" as const,
                firstSeen: "6h ago",
                pattern: "Rotating proxies with identical payloads",
                techniques: ["Reflected XSS", "DOM-based XSS", "Stored XSS attempts"],
              },
              {
                name: "Credential Stuffing",
                description: "Burst login attempts using likely leaked credential lists. Rate limiting engaged on authentication endpoints.",
                ips: 8,
                severity: "HIGH" as const,
                firstSeen: "1h ago",
                pattern: "High-frequency auth requests from TOR exit nodes",
                techniques: ["Password spraying", "Credential rotation", "Session fixation"],
              },
            ].map((pattern) => (
              <div
                key={pattern.name}
                className="border border-border rounded-lg p-5 space-y-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-semibold text-foreground">{pattern.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono ${severityBg[pattern.severity]} ${severityColors[pattern.severity]}`}>
                    {pattern.severity}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{pattern.description}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Source IPs</span>
                    <span className="font-mono text-foreground">{pattern.ips}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">First Seen</span>
                    <span className="font-mono text-foreground">{pattern.firstSeen}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Techniques:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pattern.techniques.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-primary font-mono">{pattern.pattern}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Attack Map */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Global Attack Map</h3>
              <p className="text-sm text-muted-foreground">Live visualization of attack origins targeting this portfolio</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-muted-foreground">Active Attacks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Blocked</span>
              </div>
            </div>
          </div>
          <AttackMap />
        </div>
      </main>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-card border border-border rounded-xl max-w-lg w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Event Details</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-mono ${severityBg[selectedEvent.severity]} ${severityColors[selectedEvent.severity]}`}
                >
                  {selectedEvent.severity}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 font-mono">{selectedEvent.id}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground font-mono">TYPE</label>
                  <p className="text-sm text-foreground font-mono mt-1">{selectedEvent.type}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-mono">ACTION</label>
                  <p className="text-sm text-foreground font-mono mt-1">{selectedEvent.action}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-mono">SOURCE IP</label>
                  <p className="text-sm text-foreground font-mono mt-1">{selectedEvent.ip}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-mono">COUNTRY</label>
                  <p className="text-sm text-foreground font-mono mt-1">{selectedEvent.country}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground font-mono">TIMESTAMP</label>
                  <p className="text-sm text-foreground font-mono mt-1">
                    {selectedEvent.timestamp.toLocaleString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground font-mono">USER AGENT</label>
                  <p className="text-sm text-foreground font-mono mt-1 break-all">{selectedEvent.userAgent}</p>
                </div>
                {selectedEvent.payload && (
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground font-mono">PAYLOAD</label>
                    <pre className="text-sm text-red-400 font-mono mt-1 p-3 bg-muted/50 rounded-lg overflow-x-auto">
                      {selectedEvent.payload}
                    </pre>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Add to Blocklist
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
