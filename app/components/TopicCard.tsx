"use client"

import { useState } from "react"
import { TopicWithStats as Topic } from "../utils/db"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react" // Add this import
import { cn } from "@/lib/utils"
import { LoadingOverlay } from "./LoadingOverlay"

const pastelColors = [
  "bg-pink-50/80 hover:bg-pink-100/60 text-pink-600/90 border-pink-200/60",
  "bg-blue-50/80 hover:bg-blue-100/60 text-blue-600/90 border-blue-200/60",
  "bg-green-50/80 hover:bg-green-100/60 text-green-600/90 border-green-200/60",
  "bg-purple-50/80 hover:bg-purple-100/60 text-purple-600/90 border-purple-200/60",
  "bg-amber-50/80 hover:bg-amber-100/60 text-amber-600/90 border-amber-200/60",
  "bg-indigo-50/80 hover:bg-indigo-100/60 text-indigo-600/90 border-indigo-200/60",
]

export function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const colorClasses = pastelColors[index % pastelColors.length]

  const handleClick = async () => {
    try {
      setIsLoading(true)
      setError(false)
      const response = await fetch(`/api/topics/slug?name=${encodeURIComponent(topic.name)}`)
      if (!response.ok) throw new Error('Failed to get topic slug')
      const { slug } = await response.json()
      
      // Show loading overlay before navigation
      document.body.style.overflow = 'hidden'
      
      // Push the route but don't wait for it
      router.push(`/topics/${slug}`)
      
      // Add a minimum loading time of 1 second plus some random delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500))
      
      // Keep loading state for a bit after navigation starts
      const cleanup = () => {
        setIsLoading(false)
        document.body.style.overflow = ''
      }
      
      // Cleanup after a short delay or if user navigates back
      setTimeout(cleanup, 500)
      window.addEventListener('popstate', cleanup, { once: true })
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(true)
      setIsLoading(false)
      document.body.style.overflow = ''
      setTimeout(() => setError(false), 3000)
    }
  }

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <div 
        className={cn(
          colorClasses,
          "rounded-2xl border transition-all duration-200",
          "hover:shadow-lg hover:shadow-current/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current",
          "flex flex-col min-h-[260px]", // Slightly reduced height
          isLoading ? "pointer-events-none" : "cursor-pointer"
        )}
        onClick={handleClick}
        tabIndex={0}
        role="button"
        aria-disabled={isLoading}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        {/* Main content wrapper */}
        <div className="flex flex-col flex-1">
          {/* Top section with icon and description */}
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-white/50 shrink-0">
                {topic.icon_url ? (
                  <Image
                    src={topic.icon_url}
                    alt={topic.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/48"
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/80">
                    {topic.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0"> {/* Added min-w-0 for better text wrapping */}
                <h3 className="text-lg font-semibold mb-1 break-words">{topic.name}</h3>
                <p className="text-sm opacity-90 line-clamp-2 text-gray-600">
                  {topic.description || "No description available"}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section - Now at bottom */}
          <div className="mt-auto p-4 pt-0">
            <div className="grid grid-cols-3 gap-2">
              <StatBadge 
                label="Communities" 
                value={topic.total_communities} 
                className="bg-white/60"
              />
              <StatBadge 
                label="Members" 
                value={topic.total_members} 
                className="bg-white/60"
              />
              <StatBadge 
                label="Votes" 
                value={topic.total_votes} 
                className="bg-white/60"
              />
            </div>
          </div>
        </div>

        {/* View Communities Button */}
        <div className="border-t border-current/10">
          <div className="px-4 py-3 flex items-center justify-between text-sm font-medium hover:bg-black/5 transition-colors">
            <span className="flex items-center gap-2">
              {error && <AlertCircle className="w-4 h-4" />}
              {isLoading && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {error ? 'Try again' : isLoading ? 'Loading...' : 'View Communities'}
            </span>
            <ArrowRight className={cn(
              "w-4 h-4 transition-transform",
              !isLoading && "group-hover:translate-x-1",
              isLoading && "opacity-50"
            )} />
          </div>
        </div>
      </div>
    </>
  )
}

function StatBadge({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className={`px-3 py-2 rounded-lg text-center ${className} flex flex-col justify-center`}>
      <div className="text-[11px] uppercase tracking-wide font-medium opacity-70">{label}</div>
      <div className="text-sm font-semibold mt-0.5">
        {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)}
      </div>
    </div>
  )
}
