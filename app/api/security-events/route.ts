import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get("limit") || "50")
  const severity = searchParams.get("severity") || undefined
  const search = searchParams.get("search") || undefined

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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  const body = await request.json()
  const supabase = await createClient()

  const event = {
    event_id: body.event_id || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    type: body.type || "UNKNOWN",
    severity: body.severity || "LOW",
    source_ip: body.source_ip || "0.0.0.0",
    country: body.country || "Unknown",
    action: body.action || "LOGGED",
    user_agent: body.user_agent || null,
    payload: body.payload || null,
    request_path: body.request_path || null,
    description: body.description || null,
    created_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("security_events").insert(event)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, event_id: event.event_id })
}
