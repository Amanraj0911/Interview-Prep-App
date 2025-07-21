"use client"

import type React from "react"

import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Brain, LogOut, Camera } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.profileImageUrl) {
      setProfileImage(user.profileImageUrl)
    }
  }, [user])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("image", file)

      const token = localStorage.getItem("token")
      const response = await fetch("/api/auth/upload-profile-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      setProfileImage(data.profileImageUrl)

      toast({
        title: "Success! 🎉",
        description: "Profile image updated successfully",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload profile image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-indigo-400/20 to-purple-500/20 rounded-full blur-xl animate-float-gentle"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-lg animate-float-reverse"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-2xl animate-float-gentle"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-xl animate-float-reverse"></div>
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.1)_1px,transparent_0)] bg-[length:40px_40px] opacity-30"></div>

      {/* Header */}
      <header className="relative border-b border-white/20 bg-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse-ring bg-indigo-400/30 rounded-full"></div>
                <Brain className="h-10 w-10 text-indigo-600 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Interview Prep AI
                </span>
                <div className="text-sm text-indigo-600 font-medium">AI-Powered Success</div>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              {/* Profile Dropdown - Only Image Upload */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-12 w-12 rounded-full hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="relative group">
                      <Avatar className="h-12 w-12 border-2 border-white/30 shadow-lg">
                        <AvatarImage
                          src={profileImage || user.profileImageUrl || "/placeholder.svg?height=48&width=48"}
                          alt={user.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-lg">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {uploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 mr-4 bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-2"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="text-center">
                      <div className="relative group cursor-pointer mx-auto w-fit" onClick={triggerImageUpload}>
                        <Avatar className="h-16 w-16 border-2 border-indigo-200 shadow-lg mx-auto">
                          <AvatarImage
                            src={profileImage || user.profileImageUrl || "/placeholder.svg?height=64&width=64"}
                            alt={user.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-xl">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {uploading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Camera className="h-5 w-5 text-white" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-indigo-600 mt-3 font-medium">Click to update photo</p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Logout Button */}
              <Button
                onClick={logout}
                variant="outline"
                className="bg-white/20 border-white/30 hover:bg-red-50 hover:border-red-300 text-red-600 font-medium px-4 py-2 rounded-xl transition-all duration-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>

            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">{children}</main>
    </div>
  )
}
