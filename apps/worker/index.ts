import { describeServiceStatus } from "@workspace/shared"
import { Pool } from "pg"

const DEFAULT_PORT = 4000
const SAMPLE_QUERY = `
  select id, name, tier, active
  from sample_customers
  order by id asc
`

export type SampleCustomer = {
  id: number
  name: string
  tier: string
  active: boolean
}

export type HealthPayload = {
  appName: string
  environment: string
  healthy: boolean
  database: {
    configured: boolean
    connected: boolean
    seededCustomers: number
  }
}

export function getServicePort(value = process.env.PORT) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_PORT
}

export function buildHealthPayload({
  environment,
  databaseConfigured,
  databaseConnected,
  seededCustomers,
}: {
  environment: string
  databaseConfigured: boolean
  databaseConnected: boolean
  seededCustomers: number
}): HealthPayload {
  return {
    appName: "worker",
    environment,
    healthy: !databaseConfigured || databaseConnected,
    database: {
      configured: databaseConfigured,
      connected: databaseConnected,
      seededCustomers,
    },
  }
}

export async function fetchDatabaseSummary(connectionString?: string) {
  if (!connectionString) {
    return {
      connected: false,
      customers: [] as SampleCustomer[],
      seededCustomers: 0,
    }
  }

  const pool = new Pool({ connectionString })

  try {
    const result = await pool.query<SampleCustomer>(SAMPLE_QUERY)
    return {
      connected: true,
      customers: result.rows,
      seededCustomers: result.rowCount ?? result.rows.length,
    }
  } finally {
    await pool.end()
  }
}

export async function buildRootMessage() {
  const environment = process.env.NODE_ENV ?? "development"
  const summary = await fetchDatabaseSummary(process.env.DATABASE_URL)
  return describeServiceStatus({
    appName: "worker",
    environment,
    healthy: !process.env.DATABASE_URL || summary.connected,
  })
}

export function createServer() {
  return Bun.serve({
    port: getServicePort(),
    async fetch(request) {
      const url = new URL(request.url)
      const environment = process.env.NODE_ENV ?? "development"
      const hasDatabase = Boolean(process.env.DATABASE_URL)

      if (url.pathname === "/health") {
        const summary = await fetchDatabaseSummary(process.env.DATABASE_URL)
        const payload = buildHealthPayload({
          environment,
          databaseConfigured: hasDatabase,
          databaseConnected: summary.connected,
          seededCustomers: summary.seededCustomers,
        })

        return Response.json(payload, {
          status: payload.healthy ? 200 : 503,
        })
      }

      if (url.pathname === "/customers") {
        const summary = await fetchDatabaseSummary(process.env.DATABASE_URL)
        return Response.json({
          customers: summary.customers,
        })
      }

      return new Response(await buildRootMessage(), {
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      })
    },
  })
}

if (import.meta.main) {
  const server = createServer()
  console.log(`worker listening on http://0.0.0.0:${server.port}`)
}
