"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Form, Input, Button, Card, message, Spin } from "antd"
import { MailOutlined, LockOutlined } from "@ant-design/icons"
import Link from "next/link"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"

export default function SignupPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push("/products")
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  const handleSignup = async (values: { email: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password)
      message.success("Account created successfully!")
    } catch (error: any) {
      message.error(error.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="w-full max-w-md">
        <Card
          className="shadow-2xl border-0 rounded-2xl overflow-hidden backdrop-blur-sm"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          <div className="text-center mb-8 animate-slide-in-right">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <span className="text-4xl">📦</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
              Product Manager
            </h1>
            <p className="text-gray-500 text-sm font-medium">Create your account to get started</p>
          </div>

          <Spin spinning={loading}>
            <Form form={form} layout="vertical" onFinish={handleSignup} autoComplete="off">
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-blue-400" />}
                  placeholder="Email address"
                  size="large"
                  className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-blue-400" />}
                  placeholder="Password"
                  size="large"
                  className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                />
              </Form.Item>

              <Form.Item name="confirmPassword" rules={[{ required: true, message: "Please confirm your password" }]}>
                <Input.Password
                  prefix={<LockOutlined className="text-blue-400" />}
                  placeholder="Confirm password"
                  size="large"
                  className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                className="rounded-lg h-12 font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:shadow-xl transition-all duration-300 text-white"
              >
                Create Account
              </Button>
            </Form>
          </Spin>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-indigo-600 transition-colors duration-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
