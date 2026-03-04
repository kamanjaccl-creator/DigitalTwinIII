import { neon } from "@neondatabase/serverless"

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  return neon(process.env.DATABASE_URL)
}

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
  const sql = getDb()
  
  if (severity && severity !== "ALL" && search) {
    return sql`
      SELECT * FROM security_events
      WHERE severity = ${severity}
        AND (type ILIKE ${'%' + search + '%'} OR source_ip ILIKE ${'%' + search + '%'} OR country ILIKE ${'%' + search + '%'})
      ORDER BY created_at DESC
      LIMIT ${limit}
    ` as unknown as SecurityEvent[]
  }
  
  if (severity && severity !== "ALL") {
    return sql`
      SELECT * FROM security_events
      WHERE severity = ${severity}
      ORDER BY created_at DESC
      LIMIT ${limit}
    ` as unknown as SecurityEvent[]
  }
  
  if (search) {
    return sql`
      SELECT * FROM security_events
      WHERE type ILIKE ${'%' + search + '%'} OR source_ip ILIKE ${'%' + search + '%'} OR country ILIKE ${'%' + search + '%'}
      ORDER BY created_at DESC
      LIMIT ${limit}
    ` as unknown as SecurityEvent[]
  }
  
  return sql`
    SELECT * FROM security_events
    ORDER BY created_at DESC
    LIMIT ${limit}
  ` as unknown as SecurityEvent[]
}

export async function getDashboardMetrics() {
  const sql = getDb()
  const rows = await sql`SELECT metric_key, metric_value FROM dashboard_metrics` as unknown as DashboardMetric[]
  const metrics: Record<string, string> = {}
  for (const row of rows) {
    metrics[row.metric_key] = row.metric_value
  }
  return metrics
}

export async function getEventCountsBySeverity() {
  const sql = getDb()
  return sql`
    SELECT severity, COUNT(*) as count 
    FROM security_events 
    GROUP BY severity
  ` as unknown as { severity: string; count: string }[]
}

export async function getEventCountsByType() {
  const sql = getDb()
  return sql`
    SELECT type, COUNT(*) as count 
    FROM security_events 
    GROUP BY type 
    ORDER BY count DESC
  ` as unknown as { type: string; count: string }[]
}

export async function getEventCountsByCountry() {
  const sql = getDb()
  return sql`
    SELECT country, COUNT(*) as count 
    FROM security_events 
    GROUP BY country 
    ORDER BY count DESC
    LIMIT 10
  ` as unknown as { country: string; count: string }[]
}

export async function getEventCountsByAction() {
  const sql = getDb()
  return sql`
    SELECT action, COUNT(*) as count 
    FROM security_events 
    GROUP BY action
  ` as unknown as { action: string; count: string }[]
}

export async function getRecentEventsPerHour() {
  const sql = getDb()
  return sql`
    SELECT 
      date_trunc('hour', created_at) as hour,
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE action = 'BLOCKED') as blocked
    FROM security_events
    WHERE created_at > NOW() - INTERVAL '24 hours'
    GROUP BY hour
    ORDER BY hour ASC
  ` as unknown as { hour: string; total: string; blocked: string }[]
}

export async function isUserAdmin(clerkUserId: string): Promise<boolean> {
  const sql = getDb()
  const result = await sql`
    SELECT id FROM admin_users WHERE clerk_user_id = ${clerkUserId}
  `
  return result.length > 0
}

export async function addAdminUser(clerkUserId: string, email: string) {
  const sql = getDb()
  await sql`
    INSERT INTO admin_users (clerk_user_id, email, role)
    VALUES (${clerkUserId}, ${email}, 'admin')
    ON CONFLICT (clerk_user_id) DO NOTHING
  `
}
