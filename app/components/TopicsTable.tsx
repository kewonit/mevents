import { TopicWithStats as Topic } from "../utils/db"
import { AlertCircle, BookOpen, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TopicCard } from "./TopicCard"
import { TopicCardSkeleton } from "./TopicCardSkeleton"

type TopicsTableProps = {
  topics: Topic[]
  isLoading?: boolean
  error?: string | null
}

export function TopicsTable({ topics, isLoading, error }: TopicsTableProps) {
  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-white/80 rounded-2xl border border-gray-200">
          <AlertCircle className="w-8 h-8 mb-2 text-red-500" />
          <p className="text-lg font-medium">Failed to load topics</p>
          <p className="text-sm">{error}</p>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 max-w-7xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <TopicCardSkeleton key={i} />
          ))}
        </div>
      )
    }

    if (!topics.length) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-white/80 rounded-2xl border border-gray-200">
          <Search className="w-8 h-8 mb-2" />
          <p className="text-lg font-medium">No topics found</p>
          <p className="text-sm">Try adjusting your search criteria</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 max-w-7xl mx-auto">
        {topics.map((topic, index) => (
          <TopicCard 
            key={topic.id} 
            topic={topic} 
            index={index}
          />
        ))}
        <div 
          className={`
            rounded-2xl border border-dashed border-gray-300
            flex flex-col items-center justify-center p-8 
            text-gray-500 bg-white/30 backdrop-blur-sm
            min-h-[240px] // Match the height of other cards
            hover:bg-white/40 transition-colors
            cursor-default
          `}
        >
          <div className="text-2xl font-semibold mb-2">🎉</div>
          <p className="text-lg font-medium text-center">Hundreds More</p>
          <p className="text-sm text-center mt-1">Coming Soon</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-gradient-to-r from-[#f3f1ea] to-[#e0d8c3] pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Stats header */}
        <div className="px-4 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10">
          <div className="flex flex-col sm:flex-row items-stretch justify-between mb-8 gap-3 sm:gap-4">
            <div className="bg-[#EBE9E0]/40 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 flex items-center gap-4 flex-1">
              <div className="p-2.5 sm:p-3 bg-white/60 rounded-xl shrink-0">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary/70" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-instrument-serif text-gray-900 truncate">
                  Knowledge Topics
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base line-clamp-2 sm:line-clamp-1 font-instrument-serif">
                  Explore and join communities based on your interests
                </p>
              </div>
            </div>
            <div className="bg-[#EBE9E0]/40 backdrop-blur-sm border border-gray-200 rounded-2xl flex items-center justify-center p-4 sm:px-6 h-[64px] sm:h-auto">
              <Badge variant="outline" className="text-sm sm:text-base border-0 bg-transparent whitespace-nowrap">
                {topics.length} Topics
              </Badge>
            </div>
          </div>
        </div>

        {/* Dynamic content based on state */}
        {renderContent()}
      </div>
    </div>
  )
}
