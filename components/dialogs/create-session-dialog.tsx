"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertCircle, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CreateSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSessionCreated: () => void
}

export function CreateSessionDialog({ open, onOpenChange, onSessionCreated }: CreateSessionDialogProps) {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
    numberOfQuestions: "10",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // First, generate questions using AI
      const token = localStorage.getItem("token")
      const questionsResponse = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: formData.role,
          experience: formData.experience,
          topicsToFocus: formData.topicsToFocus,
          numberOfQuestions: Number.parseInt(formData.numberOfQuestions),
        }),
      })

      if (!questionsResponse.ok) {
        const errorData = await questionsResponse.json()

        // Handle specific error types
        if (errorData.error === "API_KEY_INVALID") {
          throw new Error("AI service configuration error. Please contact support.")
        } else if (errorData.error === "QUOTA_EXCEEDED") {
          throw new Error("AI service quota exceeded. Please try again later.")
        } else if (errorData.error === "INVALID_AI_RESPONSE") {
          throw new Error("AI service returned invalid data. Please try again.")
        } else {
          throw new Error(errorData.message || "Failed to generate questions")
        }
      }

      const questions = await questionsResponse.json()

      // Validate that we actually got questions
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("No questions were generated. Please try again.")
      }

      // Then create the session with the generated questions
      const sessionResponse = await fetch("/api/sessions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          questions,
        }),
      })

      if (!sessionResponse.ok) {
        throw new Error("Failed to create session")
      }

      toast({
        title: "Success!",
        description: `Interview session created with ${questions.length} AI-generated questions`,
      })

      setFormData({
        role: "",
        experience: "",
        topicsToFocus: "",
        description: "",
        numberOfQuestions: "10",
      })
      onOpenChange(false)
      onSessionCreated()
    } catch (error) {
      console.error("Error creating session:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create session"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-3xl border-0 shadow-2xl p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-8 pt-8 pb-6 space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">Create New Interview Session</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            >
              {/* <X className="h-4 w-4 text-gray-500" /> */}
            </Button>
          </div>
          <DialogDescription className="text-gray-600 text-base leading-relaxed">
            Set up your interview preparation session. AI will generate personalized questions based on your inputs.
          </DialogDescription>
        </DialogHeader>

        {/* Error Alert */}
        {error && (
          <div className="px-8">
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          {/* Job Role */}
          <div className="space-y-3">
            <Label htmlFor="role" className="text-sm font-semibold text-gray-900">
              Job Role <span className="text-red-500">*</span>
            </Label>
            <Input
              id="role"
              placeholder="e.g., Frontend Developer, Full Stack Engineer"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
              className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white transition-all duration-200"
            />
          </div>

          {/* Experience Level */}
          <div className="space-y-3">
            <Label htmlFor="experience" className="text-sm font-semibold text-gray-900">
              Experience Level <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.experience}
              onValueChange={(value) => setFormData({ ...formData, experience: value })}
              required
            >
              <SelectTrigger className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200">
                <SelectItem value="Entry Level (0-1 years)" className="text-base py-3">
                  Entry Level (0-1 years)
                </SelectItem>
                <SelectItem value="Junior (1-3 years)" className="text-base py-3">
                  Junior (1-3 years)
                </SelectItem>
                <SelectItem value="Mid-Level (3-5 years)" className="text-base py-3">
                  Mid-Level (3-5 years)
                </SelectItem>
                <SelectItem value="Senior (5-8 years)" className="text-base py-3">
                  Senior (5-8 years)
                </SelectItem>
                <SelectItem value="Lead/Principal (8+ years)" className="text-base py-3">
                  Lead/Principal (8+ years)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Topics to Focus On */}
          <div className="space-y-3">
            <Label htmlFor="topics" className="text-sm font-semibold text-gray-900">
              Topics to Focus On <span className="text-red-500">*</span>
            </Label>
            <Input
              id="topics"
              placeholder="e.g., React, Node.js, System Design, Algorithms"
              value={formData.topicsToFocus}
              onChange={(e) => setFormData({ ...formData, topicsToFocus: e.target.value })}
              required
              className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white transition-all duration-200"
            />
          </div>

          {/* Number of Questions */}
          <div className="space-y-3">
            <Label htmlFor="numberOfQuestions" className="text-sm font-semibold text-gray-900">
              Number of Questions
            </Label>
            <Select
              value={formData.numberOfQuestions}
              onValueChange={(value) => setFormData({ ...formData, numberOfQuestions: value })}
            >
              <SelectTrigger className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200">
                <SelectItem value="5" className="text-base py-3">
                  5 Questions
                </SelectItem>
                <SelectItem value="10" className="text-base py-3">
                  10 Questions
                </SelectItem>
                <SelectItem value="15" className="text-base py-3">
                  15 Questions
                </SelectItem>
                <SelectItem value="20" className="text-base py-3">
                  20 Questions
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-900">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Any specific requirements or focus areas..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white resize-none transition-all duration-200"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 h-12 text-base font-semibold border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Session"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
