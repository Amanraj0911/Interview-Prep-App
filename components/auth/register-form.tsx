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

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await register(name, email, password)
      toast({
        title: "Welcome to Interview Prep! 🎉",
        description: "Your account has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
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
        <div className="absolute top-16 left-16 w-36 h-36 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full blur-xl animate-float-gentle"></div>
        <div className="absolute top-32 right-24 w-28 h-28 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-lg animate-float-reverse"></div>
        <div className="absolute bottom-24 left-24 w-44 h-44 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl animate-float-gentle"></div>
        <div className="absolute bottom-16 right-16 w-32 h-32 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-xl animate-float-reverse"></div>

        {/* Animated Gradient Shapes */}
        <div className="absolute top-1/3 left-1/5 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg rotate-45 animate-pulse"></div>
        <div className="absolute top-2/3 right-1/5 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/8 w-10 h-10 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/2 right-1/8 w-12 h-12 bg-gradient-to-r from-pink-500/25 to-purple-500/25 rounded-lg rotate-12 animate-pulse"></div>

        {/* Moving Lines */}
        <div className="absolute top-1/4 right-1/4 w-40 h-0.5 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent animate-pulse"></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-32 h-0.5 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/6 w-28 h-0.5 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(139,92,246,0.1)_1px,transparent_0)] bg-[length:45px_45px] animate-pulse opacity-30"></div>

        {/* Additional Floating Elements */}
        <div
          className="absolute top-1/6 right-1/3 w-6 h-6 bg-gradient-to-r from-yellow-400/40 to-orange-400/40 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/6 left-1/3 w-8 h-8 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/30"></div>

      {/* Centered Registration Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-8">
        <Card className="w-full max-w-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-6 pt-10 px-10">
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-24 h-24 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Brain className="h-12 w-12 text-indigo-600" />
                <Sparkles className="h-5 w-5 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 mb-4">Create Your Account</CardTitle>
            <p className="text-gray-600 text-lg">Start your journey to interview success today</p>
          </CardHeader>

          <CardContent className="px-10 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-semibold text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-14 text-lg border-2 border-white/30 bg-white/50 backdrop-blur-sm focus:border-indigo-400 focus:bg-white/70 rounded-xl transition-all duration-300 px-4"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-semibold text-gray-700">
                  Email Address
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
                <Label htmlFor="password" className="text-base font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
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

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-base font-semibold text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-14 text-lg border-2 border-white/30 bg-white/50 backdrop-blur-sm focus:border-indigo-400 focus:bg-white/70 rounded-xl transition-all duration-300 px-4"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Free Account →"
                )}
              </Button>

              <div className="text-center pt-6">
                <p className="text-gray-600 text-lg mb-6">ALREADY HAVE AN ACCOUNT?</p>
                <Button
                  variant="outline"
                  asChild
                  className="w-full h-14 text-lg font-semibold border-2 border-white/40 bg-white/30 backdrop-blur-sm hover:bg-white/50 rounded-xl transition-all duration-300"
                >
                  <Link href="/auth/login">Sign In Instead</Link>
                </Button>
              </div>

              <div className="text-center pt-3">
                <p className="text-sm text-gray-500">🔒 100% secure • No spam • Cancel anytime</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
