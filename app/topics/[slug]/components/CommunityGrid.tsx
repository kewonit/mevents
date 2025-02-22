"use client"

import { CommunityWithStats } from "@/app/utils/db"
import { CommunityCard } from "./CommunityCard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

type SortOption = "members" | "votes" | "newest"

interface CommunityGridProps {
  communities: CommunityWithStats[]
}

// Change from 'export function' to 'export const' with explicit type
export const CommunityGrid: React.FC<CommunityGridProps> = ({ communities }) => {
  const [sortBy, setSortBy] = useState<SortOption>("members")

  const sortedCommunities = [...communities].sort((a, b) => {
    switch (sortBy) {
      case "members":
        return b.member_count - a.member_count
      case "votes":
        return b.vote_score - a.vote_score
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="members">Most Members</SelectItem>
            <SelectItem value="votes">Top Voted</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {sortedCommunities.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>
      
      {communities.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No communities found for this topic yet.
        </div>
      )}
    </div>
  )
}
