"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, BookOpen, Lightbulb, CheckCircle, ArrowRight } from "lucide-react"

interface ExplanationDialogProps {
  question: string
  children: React.ReactNode
}

interface ExplanationData {
  title: string
  explanation: string
}

export function ExplanationDialog({ question, children }: ExplanationDialogProps) {
  const [open, setOpen] = useState(false)
  const [explanation, setExplanation] = useState<ExplanationData | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchExplanation = async () => {
    if (explanation) return // Already loaded

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/ai/generate-explanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate explanation")
      }

      const data = await response.json()
      setExplanation(data)
    } catch (error) {
      console.error("Error fetching explanation:", error)
      toast({
        title: "Error",
        description: "Failed to generate explanation",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      fetchExplanation()
    }
  }

  // Function to format explanation text professionally
  const formatExplanationText = (text: string) => {
    if (!text) return ""

    // Split by numbered points and format them
    const sections = text.split(/(\d+\.\s)/).filter(Boolean)
    let formattedText = ""

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      if (/^\d+\.\s$/.test(section)) {
        // This is a number, add it with the next section
        const nextSection = sections[i + 1] || ""
        formattedText += `\n\n${section}${nextSection.replace(/\*\*(.*?)\*\*/g, "$1").trim()}`
        i++ // Skip the next section since we've already processed it
      } else if (i === 0) {
        // This is the first section (introduction)
        formattedText += section.replace(/\*\*(.*?)\*\*/g, "$1").trim()
      }
    }

    return formattedText.trim()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl">
        {/* Header with gradient background */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-t-3xl"></div>

        <DialogHeader className="relative z-10 pb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                {explanation?.title || "Concept Explanation"}
              </DialogTitle>
              <DialogDescription className="text-gray-600 font-medium mt-1">
                AI-powered detailed explanation
              </DialogDescription>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Question:</h4>
                <p className="text-blue-800 font-medium leading-relaxed">{question}</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Explanation...</h3>
                <p className="text-gray-600">Our AI is analyzing the concept and preparing a detailed explanation</p>
              </div>
            </div>
          ) : explanation ? (
            <div className="space-y-6">
              {/* Professional Explanation Card */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Detailed Explanation</h3>
                </div>

                <div className="prose prose-gray max-w-none">
                  <div className="text-gray-800 leading-relaxed space-y-4">
                    {formatExplanationText(explanation.explanation)
                      .split("\n\n")
                      .map((paragraph, index) => {
                        if (paragraph.match(/^\d+\./)) {
                          // This is a numbered point
                          const [number, ...rest] = paragraph.split(" ")
                          return (
                            <div
                              key={index}
                              className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                            >
                              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                                {number.replace(".", "")}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 leading-relaxed">{rest.join(" ")}</p>
                              </div>
                            </div>
                          )
                        } else {
                          // Regular paragraph
                          return (
                            <p key={index} className="font-medium text-gray-800 leading-relaxed">
                              {paragraph}
                            </p>
                          )
                        }
                      })}
                  </div>
                </div>
              </div>

              {/* Success Footer */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                <div className="flex items-center justify-center space-x-2 text-emerald-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Explanation generated successfully!</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Click to generate a detailed explanation</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
