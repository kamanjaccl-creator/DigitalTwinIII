import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("dashboard_metrics")
    .select("metric_key, metric_value")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const metrics: Record<string, string> = {}
  for (const row of data || []) {
    metrics[row.metric_key] = row.metric_value
  }

  return NextResponse.json(metrics)
}

export async function POST(request: Request) {
  const body = await request.json()
  const supabase = await createClient()

  const { metric_key, metric_value } = body

  if (!metric_key || metric_value === undefined) {
    return NextResponse.json(
      { error: "metric_key and metric_value are required" },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from("dashboard_metrics")
    .upsert(
      {
        metric_key,
        metric_value: String(metric_value),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "metric_key" }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
