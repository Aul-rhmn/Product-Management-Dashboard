import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"

const EXTERNAL_API_BASE = "http://localhost:8001"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get("product_id")

    if (!productId) {
      return NextResponse.json({ error: "product_id is required" }, { status: 400 })
    }

    const response = await axios.get(`${EXTERNAL_API_BASE}/api/web/v1/product?product_id=${productId}`)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await axios.post(`${EXTERNAL_API_BASE}/api/web/v1/product`, body)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await axios.put(`${EXTERNAL_API_BASE}/api/web/v1/product`, body)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get("product_id")

    if (!productId) {
      return NextResponse.json({ error: "product_id is required" }, { status: 400 })
    }

    const response = await axios.delete(`${EXTERNAL_API_BASE}/api/web/v1/product`, {
      data: { product_id: productId },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("Error deleting product:", error.response?.data || error.message)
    return NextResponse.json(
      { error: error.response?.data?.error || "Failed to delete product" },
      { status: error.response?.status || 500 },
    )
  }
}
