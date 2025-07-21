import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: [true, "Please specify the job role for the session"],
    },
    experience: {
      type: String,
      required: [true, "Please specify the years of experience"],
    },
    topicsToFocus: {
      type: String,
      required: [true, "Please provide topics to focus on"],
    },
    description: {
      type: String,
      default: "",
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  {
    timestamps: true,
  },
)

const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema)

export default Session
