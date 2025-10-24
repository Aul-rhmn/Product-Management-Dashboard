"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Spin } from "antd"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push("/products")
      } else {
        router.push("/login")
      }
    }
  }, [isAuthenticated, loading, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <Spin size="large" />
    </div>
  )
}
