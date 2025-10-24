import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"

const EXTERNAL_API_BASE = "http://localhost:8001"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get("page") || "1"
    const limit = searchParams.get("limit") || "10"
    const search = searchParams.get("search") || ""

    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
    })

    const response = await axios.get(`${EXTERNAL_API_BASE}/api/web/v1/products?${params.toString()}`)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
