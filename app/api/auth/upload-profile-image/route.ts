import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Not authorized, no token" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

      const formData = await request.formData()
      const file = formData.get("image") as File

      if (!file) {
        return NextResponse.json({ message: "No image file provided" }, { status: 400 })
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ message: "Invalid file type. Please upload an image." }, { status: 400 })
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "File too large. Please upload an image smaller than 5MB." },
          { status: 400 },
        )
      }

      // Convert file to base64 for storage (in a real app, you'd upload to a cloud service)
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`

      // Update user profile image
      const user = await User.findByIdAndUpdate(decoded.id, { profileImageUrl: base64Image }, { new: true }).select(
        "-password",
      )

      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
      }

      return NextResponse.json({
        message: "Profile image updated successfully",
        profileImageUrl: base64Image,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          profileImageUrl: user.profileImageUrl,
        },
      })
    } catch (jwtError) {
      return NextResponse.json({ message: "Not authorized, token failed" }, { status: 401 })
    }
  } catch (error) {
    console.error("Profile image upload error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
