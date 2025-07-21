"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Users,
  Zap,
  Target,
  ArrowRight,
  Play,
  Star,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  Rocket,
  Lightbulb,
  Twitter,
  Instagram,
  Mail,
  Phone,
  Facebook,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isVideoHovered, setIsVideoHovered] = useState(false)
  const [typedText, setTypedText] = useState("")
  const fullText = "Master Your Next Technical Interview"

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed")
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll(".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [])

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Harness cutting-edge AI to generate personalized interview questions tailored to your dream role",
      gradient: "from-purple-500 via-purple-600 to-pink-500",
      iconColor: "text-white",
      shadowColor: "shadow-purple-500/25",
    },
    {
      icon: Target,
      title: "Precision Targeting",
      description:
        "Laser-focused preparation based on your specific job role, experience level, and skill requirements",
      gradient: "from-blue-500 via-blue-600 to-cyan-400",
      iconColor: "text-white",
      shadowColor: "shadow-blue-500/25",
    },
    {
      icon: Zap,
      title: "Lightning-Fast Learning",
      description: "Get instant, comprehensive explanations for complex concepts with real-world examples",
      gradient: "from-indigo-500 via-purple-500 to-pink-400",
      iconColor: "text-white",
      shadowColor: "shadow-indigo-500/25",
    },
    {
      icon: TrendingUp,
      title: "Track Your Growth",
      description: "Monitor your preparation journey with detailed analytics and progress tracking",
      gradient: "from-emerald-500 via-teal-500 to-cyan-400",
      iconColor: "text-white",
      shadowColor: "shadow-emerald-500/25",
    },
  ]

  const benefits = [
    { icon: Rocket, text: "Generate unlimited practice questions instantly" },
    { icon: Lightbulb, text: "Get AI-powered explanations for complex topics" },
    { icon: Star, text: "Pin and organize your most important questions" },
    { icon: Target, text: "Role-specific interview preparation strategies" },
  ]

  const testimonials = [
    {
      name: "Avanish Gurjar",
      role: "Senior Frontend Developer",
      company: "Google",
      content:
        "Interview Prep transformed my preparation process. The AI-generated questions were spot-on and helped me land my dream job at Google!",
      rating: 5,
      image: "/avanish_gurjar.jpg",
      fallbackImage: "/placeholder.svg?height=64&width=64&text=AG",
    },
    {
      name: "Piyush Priyadarshi",
      role: "Full Stack Engineer",
      company: "Microsoft",
      content:
        "Finally, a platform that understands what modern interviews actually require. The personalized approach made all the difference.",
      rating: 4,
      image: "/piyush.jpg",
      fallbackImage: "/placeholder.svg?height=64&width=64&text=PP",
    },
    {
      name: "Rohan Phutke",
      role: "Software Architect",
      company: "Amazon",
      content:
        "The instant explanations and progress tracking helped me identify my weak areas and improve systematically. Highly recommended!",
      rating: 5,
      image: "/rohan.jpg",
      fallbackImage: "/placeholder.svg?height=64&width=64&text=RP",
    },
  ]

  // Component for handling image loading with fallback
  const TestimonialImage = ({
    src,
    fallback,
    alt,
    className,
  }: { src: string; fallback: string; alt: string; className: string }) => {
    const [imgSrc, setImgSrc] = useState(src)
    const [isLoading, setIsLoading] = useState(true)

    const handleError = () => {
      setImgSrc(fallback)
      setIsLoading(false)
    }

    const handleLoad = () => {
      setIsLoading(false)
    }

    return (
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full animate-pulse flex items-center justify-center">
            <div className="text-indigo-600 font-bold text-sm">
              {alt
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </div>
        )}
        <img
          src={imgSrc || "/placeholder.svg"}
          alt={alt}
          className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
          onError={handleError}
          onLoad={handleLoad}
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="floating-orb floating-orb-1"></div>
        <div className="floating-orb floating-orb-2"></div>
        <div className="floating-orb floating-orb-3"></div>
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-dots opacity-40"></div>
      <div className="fixed inset-0 bg-gradient-radial"></div>

      {/* Header */}
      <header className="relative border-b border-white/20 bg-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4 animate-bounce-in">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse-ring bg-indigo-400 rounded-full"></div>
              <Brain className="h-12 w-12 text-indigo-600 relative z-10" />
              <Sparkles className="h-5 w-5 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <span className="text-3xl font-bold text-gradient-primary">Interview Prep</span>
              <div className="text-sm text-indigo-600 font-semibold">AI-Powered Success</div>
            </div>
          </div>
          <div className="space-x-4 animate-slide-up-fade">
            <Button
              variant="ghost"
              asChild
              className="hover:bg-white/20 transition-all duration-300 text-gray-700 font-semibold text-lg px-6 py-2"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg btn-glow font-semibold px-8 py-2 text-lg"
            >
              <Link href="/auth/register">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8 scroll-reveal-left">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 px-4 py-2 text-sm font-semibold animate-bounce-in">
                  <Star className="w-4 h-4 mr-2" />
                  Trusted by 10,000+ Developers
                </Badge>

                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="text-gray-900 block">
                      {typedText}
                      <span className="animate-pulse text-indigo-600">|</span>
                    </span>
                  </h1>

                  <div className="text-xl lg:text-2xl text-gray-600 leading-relaxed space-y-2">
                    <p className="animate-slide-up-fade" style={{ animationDelay: "0.5s" }}>
                      Transform your interview preparation with{" "}
                      <span className="font-bold text-gradient-primary">AI-powered questions</span>,{" "}
                      <span className="font-bold text-gradient-primary">instant explanations</span>, and{" "}
                      <span className="font-bold text-gradient-primary">personalized learning paths</span>
                    </p>
                    <p className="animate-slide-up-fade text-lg" style={{ animationDelay: "0.7s" }}>
                      designed to land you your dream tech job.
                    </p>
                  </div>
                </div>

                <div
                  className="flex flex-col sm:flex-row gap-4 animate-slide-up-fade"
                  style={{ animationDelay: "0.9s" }}
                >
                  <Button
                    size="lg"
                    className="text-lg px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl btn-glow font-semibold"
                    asChild
                  >
                    <Link href="/auth/register">
                      Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-4 border-2 border-indigo-200 hover:bg-indigo-50 transition-all duration-300 bg-white/50 backdrop-blur-sm font-semibold"
                    asChild
                  >
                    <Link href="/auth/login">Sign In to Continue</Link>
                  </Button>
                </div>

                {/* Quick Stats */}
                <div
                  className="flex items-center space-x-8 pt-4 animate-slide-up-fade"
                  style={{ animationDelay: "1.1s" }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">10K+</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">98%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">50K+</div>
                    <div className="text-sm text-gray-600">Questions Generated</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Video */}
            <div className="scroll-reveal-right">
              <div
                className="video-container relative bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 rounded-3xl shadow-2xl overflow-hidden cursor-pointer group"
                onMouseEnter={() => setIsVideoHovered(true)}
                onMouseLeave={() => setIsVideoHovered(false)}
                onClick={() => {
                  // Create a modal-like popup for the video
                  const modal = document.createElement("div")
                  modal.className =
                    "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  modal.innerHTML = `
        <div class="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
          <iframe
            src="https://www.youtube.com/embed/y_IvcxH6bp8?autoplay=1&start=0&controls=1&modestbranding=1&rel=0"
            title="Interview Prep AI Demo"
            class="w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
          <button class="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300" onclick="this.closest('.fixed').remove()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      `

                  // Close modal when clicking outside
                  modal.addEventListener("click", (e) => {
                    if (e.target === modal) {
                      modal.remove()
                    }
                  })

                  document.body.appendChild(modal)
                }}
              >
                <div className="aspect-video relative">
                  {/* YouTube Video Embed - Clearer with minimal overlay */}
                  <iframe
                    src="https://www.youtube.com/embed/y_IvcxH6bp8?autoplay=1&loop=1&playlist=y_IvcxH6bp8&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
                    title="Interview Prep AI Demo"
                    className="absolute inset-0 w-full h-full rounded-3xl"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />

                  {/* Minimal Hover Overlay - Much lighter */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                      isVideoHovered ? "bg-black/20 backdrop-blur-[1px]" : "bg-transparent"
                    }`}
                  >
                    {isVideoHovered && (
                      <div className="text-center text-white z-10 animate-fade-in">
                        <div className="transition-all duration-500 scale-110 mb-4">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 hover:bg-white/30 hover:scale-110 transition-all duration-300 shadow-2xl">
                            <Play className="h-10 w-10 text-white ml-1" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 drop-shadow-lg">Click to Watch Full Demo</h3>
                        <p className="text-gray-200 text-base drop-shadow-md">See Interview Prep AI in action</p>
                      </div>
                    )}
                  </div>

                  {/* Subtle animated border on hover */}
                  <div
                    className={`absolute inset-0 rounded-3xl border-2 transition-all duration-500 ${
                      isVideoHovered ? "border-indigo-400/60 shadow-lg shadow-indigo-400/20" : "border-transparent"
                    }`}
                  ></div>
                </div>

                {/* Video Info - Updated */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <div className="font-semibold">Live Demo</div>
                      <div className="text-sm text-gray-200">Click to watch full demo</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">LIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Caption */}
              <p className="text-center text-gray-600 mt-4 font-medium">
                🎬 Click to watch full demo • Experience the future of interview prep
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-6 py-3 font-semibold text-base">
              <Sparkles className="w-5 h-5 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to <span className="text-gradient-primary">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w3xl mx-auto leading-relaxed">
              Our AI-powered platform combines cutting-edge technology with proven interview strategies to give you the
              competitive edge you deserve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`card-hover-lift border-0 shadow-2xl scroll-reveal bg-gradient-to-br ${feature.gradient} ${feature.shadowColor} text-white overflow-hidden relative group`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <CardHeader className="text-center relative z-10 pb-4">
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 animate-pulse-ring bg-white/20 rounded-full"></div>
                    <div className="w-20 h-20 mx-auto bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <feature.icon className={`h-10 w-10 ${feature.iconColor} animate-float-gentle relative z-10`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <CardDescription className="text-white/90 text-center leading-relaxed text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-white/50 to-purple-50/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <Badge className="mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-6 py-3 font-semibold text-base">
              <Star className="w-5 h-5 mr-2" />
              Success Stories
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by <span className="text-gradient-primary">Developers Worldwide</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. Here's what successful developers are saying about Interview Prep.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="card-hover-lift border-0 shadow-xl scroll-reveal bg-white/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader className="text-left">
                  <div className="flex items-center space-x-4 mb-4">
                    <TestimonialImage
                      src={testimonial.image}
                      fallback={testimonial.fallbackImage}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 shadow-lg"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-sm font-medium text-indigo-600">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="text-left pt-0">
                  <CardDescription className="text-gray-700 text-base leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="scroll-reveal-left text-left lg:pl-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Your Success is Our <span className="text-gradient-secondary">Mission</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of successful developers who've transformed their careers with our revolutionary
                AI-powered interview preparation platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-white/30 card-hover-lift shadow-lg"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium text-lg">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="scroll-reveal-right">
              <div className="relative">
                {/* Decorative background elements */}
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-pink-500/30 rounded-2xl blur-lg"></div>

                {/* Main card */}
                <div className="relative bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 p-10 rounded-3xl shadow-2xl border border-white/40 backdrop-blur-sm overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-xl"></div>

                  <div className="relative z-10 space-y-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Started in 3 Simple Steps</h3>
                      <p className="text-gray-600">Your journey to interview success begins here</p>
                    </div>

                    <div className="flex items-center space-x-4 group">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-2xl">1</span>
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-1">Create Your Profile</h3>
                        <p className="text-gray-600 text-lg">Tell us about your target role and experience level</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 group">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-2xl">2</span>
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-1">AI Generates Questions</h3>
                        <p className="text-gray-600 text-lg">Get personalized questions tailored to your needs</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 group">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-2xl">3</span>
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-1">Practice & Excel</h3>
                        <p className="text-gray-600 text-lg">
                          Study with detailed explanations and land your dream job
                        </p>
                      </div>
                    </div>

                    {/* Call to action */}
                    <div className="text-center pt-6">
                      <Button
                        size="lg"
                        className="text-lg px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl btn-glow font-semibold"
                        asChild
                      >
                        <Link href="/auth/register">
                          Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <Brain className="h-10 w-10 text-indigo-400" />
                <div>
                  <span className="text-2xl font-bold">Interview Prep</span>
                  <div className="text-sm text-gray-400 font-medium">AI-Powered Success</div>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md text-left">
                Empowering developers worldwide to ace their technical interviews with cutting-edge AI technology and
                personalized preparation strategies.
              </p>
              <div className="flex space-x-4">
                <Badge className="bg-indigo-600 text-white px-3 py-1">
                  <Users className="w-4 h-4 mr-2" />
                  10K+ Users
                </Badge>
                <Badge className="bg-purple-600 text-white px-3 py-1">
                  <Award className="w-4 h-4 mr-2" />
                  98% Success Rate
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Features</h3>
              <ul className="space-y-3 text-gray-300 text-left">
                <li className="hover:text-white transition-colors cursor-pointer">AI Question Generation</li>
                <li className="hover:text-white transition-colors cursor-pointer">Instant Explanations</li>
                <li className="hover:text-white transition-colors cursor-pointer">Progress Tracking</li>
                <li className="hover:text-white transition-colors cursor-pointer">Role-Based Prep</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <div className="space-y-3 text-gray-300 text-left">
                <div className="flex items-center space-x-3 hover:text-white transition-colors cursor-pointer">
                  <Mail className="w-4 h-4" />
                  <span>support@interviewprep.ai</span>
                </div>
                <div className="flex items-center space-x-3 hover:text-white transition-colors cursor-pointer">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-4 pt-2">
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110 shadow-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-300 hover:scale-110 shadow-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-110 shadow-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-base">
              © 2024 <strong>Interview Prep</strong>. All rights reserved. Built with ❤️ for developers.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Last updated: December 2024</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
