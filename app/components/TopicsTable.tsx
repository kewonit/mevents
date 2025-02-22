import { Topic } from "../utils/db"
import { columns } from "./tables/topic-columns"
import { DataTable } from "./tables/data-table"
import { BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function TopicsTable({ topics }: { topics: Topic[] }) {
  return (
    <div className="p-4 bg-gradient-to-r from-[#f3f1ea] to-[#e0d8c3]">
      {/* Container div for both cards and table with consistent max-width */}
      <div className="max-w-[1280px] mx-auto"> {/* Using fixed max-width that matches max-w-7xl */}
        {/* Stats cards section */}
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

        {/* Table section with matching width */}
        <div className="p-2 sm:p-4 border-4 border-dashed border-gray-300 rounded-3xl">
          <div className="backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <DataTable columns={columns} data={topics} />
          </div>
        </div>
      </div>
    </div>
  )
}
