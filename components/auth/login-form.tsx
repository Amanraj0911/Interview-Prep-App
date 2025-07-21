"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Brain, Eye, EyeOff, Sparkles } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast({
        title: "Welcome back! 🎉",
        description: "You have been logged in successfully.",
      })
    } catch (error) {
      toast({
        title: "Oops! Something went wrong",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-indigo-400/30 to-purple-500/30 rounded-full blur-xl animate-float-gentle"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-lg animate-float-reverse"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-float-gentle"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full blur-xl animate-float-reverse"></div>

        {/* Animated Gradient Shapes */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg rotate-45 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/6 w-8 h-8 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full animate-ping"></div>

        {/* Moving Lines */}
        <div className="absolute top-1/3 right-1/3 w-32 h-0.5 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent animate-pulse"></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.1)_1px,transparent_0)] bg-[length:40px_40px] animate-pulse opacity-30"></div>
      </div>

      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/30"></div>

      {/* Centered Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <Card className="w-full max-w-lg bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-6 pt-10 px-10">
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-24 h-24 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Brain className="h-12 w-12 text-indigo-600" />
                <Sparkles className="h-5 w-5 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 mb-4">Welcome Back!</CardTitle>
            <p className="text-gray-600 text-lg">Hey, Enter your details to get sign in to your account</p>
          </CardHeader>

          <CardContent className="px-10 pb-10">
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-semibold text-gray-700">
                  Enter Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 text-lg border-2 border-white/30 bg-white/50 backdrop-blur-sm focus:border-indigo-400 focus:bg-white/70 rounded-xl transition-all duration-300 px-4"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-base font-semibold text-gray-700">
                    Password
                  </Label>
                  <button
                    type="button"
                    className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
                  >
                    Hide
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 text-lg border-2 border-white/30 bg-white/50 backdrop-blur-sm focus:border-indigo-400 focus:bg-white/70 rounded-xl transition-all duration-300 px-4 pr-14"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-4 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-left">
                <button
                  type="button"
                  className="text-base text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  Having trouble in sign in?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="text-center pt-6">
                <p className="text-gray-600 mb-6 text-lg">Don't have an account?</p>
                <Button
                  variant="outline"
                  asChild
                  className="w-full h-14 text-lg font-semibold border-2 border-white/40 bg-white/30 backdrop-blur-sm hover:bg-white/50 rounded-xl transition-all duration-300"
                >
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
