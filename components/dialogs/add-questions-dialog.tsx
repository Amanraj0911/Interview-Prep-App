"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface AddQuestionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionId: string
  onQuestionsAdded: () => void
}

export function AddQuestionsDialog({ open, onOpenChange, sessionId, onQuestionsAdded }: AddQuestionsDialogProps) {
  const [numberOfQuestions, setNumberOfQuestions] = useState("5")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get session details first
      const token = localStorage.getItem("token")
      const sessionResponse = await fetch(`/api/sessions/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!sessionResponse.ok) {
        throw new Error("Failed to fetch session details")
      }

      const sessionData = await sessionResponse.json()
      const session = sessionData.session

      // Generate new questions using AI
      const questionsResponse = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: session.role,
          experience: session.experience,
          topicsToFocus: session.topicsToFocus,
          numberOfQuestions: Number.parseInt(numberOfQuestions),
        }),
      })

      if (!questionsResponse.ok) {
        throw new Error("Failed to generate questions")
      }

      const questions = await questionsResponse.json()

      // Add questions to the session
      const addResponse = await fetch("/api/questions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          questions,
        }),
      })

      if (!addResponse.ok) {
        throw new Error("Failed to add questions")
      }

      toast({
        title: "Success!",
        description: `${numberOfQuestions} new questions added to your session`,
      })

      onOpenChange(false)
      onQuestionsAdded()
    } catch (error) {
      console.error("Error adding questions:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add questions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add More Questions</DialogTitle>
          <DialogDescription>Generate additional AI-powered questions for this session.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numberOfQuestions">Number of Questions</Label>
            <Select value={numberOfQuestions} onValueChange={setNumberOfQuestions}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Questions</SelectItem>
                <SelectItem value="10">10 Questions</SelectItem>
                <SelectItem value="15">15 Questions</SelectItem>
                <SelectItem value="20">20 Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Add Questions"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
