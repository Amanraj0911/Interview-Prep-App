import { InterviewSession } from "@/components/pages/interview-session"

export default function SessionPage({ params }: { params: { id: string } }) {
  return <InterviewSession sessionId={params.id} />
}
