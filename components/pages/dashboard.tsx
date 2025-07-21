"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Clock, Trash2, Eye, Sparkles, Target, BookOpen } from "lucide-react"
import { CreateSessionDialog } from "@/components/dialogs/create-session-dialog"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Session {
  _id: string
  role: string
  experience: string
  topicsToFocus: string
  description: string
  questions: string[]
  createdAt: string
  updatedAt: string
}

export function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/sessions/my-sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSessions(data)
      }
    } catch (error) {
      console.error("Error fetching sessions:", error)
      toast({
        title: "Error",
        description: "Failed to fetch sessions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setSessions(sessions.filter((session) => session._id !== sessionId))
        toast({
          title: "Success",
          description: "Session deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting session:", error)
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getGradientForIndex = (index: number) => {
    const gradients = [
      "from-indigo-500 via-purple-500 to-pink-500",
      "from-blue-500 via-cyan-500 to-teal-500",
      "from-purple-500 via-indigo-500 to-blue-500",
      "from-pink-500 via-rose-500 to-orange-500",
      "from-emerald-500 via-teal-500 to-cyan-500",
      "from-violet-500 via-purple-500 to-indigo-500",
    ]
    return gradients[index % gradients.length]
  }

  if (loading) {
    return (
      <div className="px-6 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-white/30 rounded-2xl w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-white/30 rounded-3xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="w-full">
        {/* Header Section with Added Spacing */}
        <div className="pt-8 pb-6 px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                    Welcome back, {user?.name}! 👋
                  </h1>
                  <p className="text-lg text-gray-600 mt-1 font-medium">Continue your interview preparation journey</p>
                </div>
              </div>

              {/* Compact Stats Cards */}
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{sessions.length}</p>
                      <p className="text-xs text-gray-600">Active Sessions</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">
                        {sessions.reduce((total, session) => total + session.questions.length, 0)}
                      </p>
                      <p className="text-xs text-gray-600">Total Questions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl px-6 py-3 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Session
            </Button>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="max-w-md mx-auto">
              <div className="mb-6 relative">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-12 w-12 text-indigo-500" />
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No interview sessions yet</h3>
              <p className="text-gray-600 mb-6 text-base leading-relaxed">
                Create your first interview preparation session to get started with AI-generated questions tailored to
                your dream job.
              </p>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl px-6 py-3 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Session
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-6">
            {sessions.map((session, index) => (
              <Card
                key={session._id}
                className="group relative overflow-hidden border-0 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white/80 backdrop-blur-sm rounded-2xl"
                style={{
                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getGradientForIndex(index)} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <CardHeader className="relative z-10 pb-3">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className={`w-8 h-8 bg-gradient-to-r ${getGradientForIndex(index)} rounded-lg flex items-center justify-center shadow-lg`}
                        >
                          <BookOpen className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
                            {session.role}
                          </CardTitle>
                          <CardDescription className="text-xs text-gray-600 font-medium">
                            {session.experience} experience
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-0 px-2 py-1 text-xs font-semibold"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {session.questions.length}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 space-y-3 pb-4">
                  <div className="space-y-2">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl border border-indigo-100">
                      <p className="text-xs font-semibold text-indigo-700 mb-1 flex items-center">
                        <Target className="w-3 h-3 mr-1" />
                        Focus Topics:
                      </p>
                      <p className="text-gray-700 font-medium text-xs">{session.topicsToFocus}</p>
                    </div>

                    {session.description && (
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-100">
                        <p className="text-xs font-semibold text-blue-700 mb-1">Description:</p>
                        <p className="text-gray-700 line-clamp-2 font-medium text-xs">{session.description}</p>
                      </div>
                    )}

                    <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                      <Clock className="mr-1 h-3 w-3" />
                      <span className="font-medium">Created {formatDate(session.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg rounded-lg transition-all duration-300 hover:scale-105 text-xs"
                    >
                      <Link href={`/session/${session._id}`}>
                        <Eye className="mr-1 h-3 w-3" />
                        Study
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-2 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 rounded-lg transition-all duration-300 bg-transparent"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-lg font-bold text-gray-900">
                            Delete Session
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            Are you sure you want to delete this session? This action cannot be undone and will remove
                            all associated questions.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteSession(session._id)}
                            className="bg-red-600 hover:bg-red-700 rounded-lg"
                          >
                            Delete Session
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <CreateSessionDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSessionCreated={fetchSessions}
        />
      </div>
    </div>
  )
}
