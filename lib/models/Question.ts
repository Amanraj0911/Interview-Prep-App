import mongoose from "mongoose"

const questionSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    question: {
      type: String,
      required: [true, "Question text cannot be empty"],
    },
    answer: {
      type: String,
      required: [true, "Answer text cannot be empty"],
    },
    note: {
      type: String,
      default: "",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const Question = mongoose.models.Question || mongoose.model("Question", questionSchema)

export default Question
