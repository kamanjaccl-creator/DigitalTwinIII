import { createClient } from "@/lib/supabase/server"

export interface SecurityEvent {
  id: number
  event_id: string
  type: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  source_ip: string
  country: string
  action: "BLOCKED" | "CHALLENGED" | "LOGGED"
  user_agent: string | null
  payload: string | null
  request_path: string | null
  description: string | null
  created_at: string
}

export interface DashboardMetric {
  metric_key: string
  metric_value: string
}

export async function getSecurityEvents(limit = 50, severity?: string, search?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("security_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (severity && severity !== "ALL") {
    query = query.eq("severity", severity)
  }

  if (search) {
    query = query.or(
      `type.ilike.%${search}%,source_ip.ilike.%${search}%,country.ilike.%${search}%`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching security events:", error)
    return []
  }

  return (data || []) as SecurityEvent[]
}

export async function getDashboardMetrics() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("dashboard_metrics")
    .select("metric_key, metric_value")

  if (error) {
    console.error("Error fetching dashboard metrics:", error)
    return {}
  }

  const metrics: Record<string, string> = {}
  for (const row of data || []) {
    metrics[row.metric_key] = row.metric_value
  }
  return metrics
}

export async function getEventCountsBySeverity() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("security_events")
    .select("severity")

  if (error) {
    console.error("Error fetching severity counts:", error)
    return []
  }

  const counts: Record<string, number> = {}
  for (const row of data || []) {
    counts[row.severity] = (counts[row.severity] || 0) + 1
  }

  return Object.entries(counts).map(([severity, count]) => ({
    severity,
    count: String(count),
  }))
}

export async function getEventCountsByType() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("security_events")
    .select("type")

  if (error) {
    console.error("Error fetching type counts:", error)
    return []
  }

  const counts: Record<string, number> = {}
  for (const row of data || []) {
    counts[row.type] = (counts[row.type] || 0) + 1
  }

  return Object.entries(counts)
    .map(([type, count]) => ({ type, count: String(count) }))
    .sort((a, b) => Number(b.count) - Number(a.count))
}

export async function getEventCountsByCountry() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("security_events")
    .select("country")

  if (error) {
    console.error("Error fetching country counts:", error)
    return []
  }

  const counts: Record<string, number> = {}
  for (const row of data || []) {
    counts[row.country] = (counts[row.country] || 0) + 1
  }

  return Object.entries(counts)
    .map(([country, count]) => ({ country, count: String(count) }))
    .sort((a, b) => Number(b.count) - Number(a.count))
    .slice(0, 10)
}

export async function getEventCountsByAction() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("security_events")
    .select("action")

  if (error) {
    console.error("Error fetching action counts:", error)
    return []
  }

  const counts: Record<string, number> = {}
  for (const row of data || []) {
    counts[row.action] = (counts[row.action] || 0) + 1
  }

  return Object.entries(counts).map(([action, count]) => ({
    action,
    count: String(count),
  }))
}

export async function insertSecurityEvent(event: {
  event_id: string
  type: string
  severity: string
  source_ip: string
  country: string
  action: string
  user_agent?: string
  payload?: string
  request_path?: string
  description?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("security_events").insert({
    ...event,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error inserting security event:", error)
    throw error
  }
}
