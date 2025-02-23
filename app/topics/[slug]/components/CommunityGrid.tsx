import { CommunityWithStats } from "@/app/utils/db"
import { CommunityCard } from "./CommunityCard"
import { VoteProvider } from "@/app/contexts/VoteContext"

type SortOption = "members" | "votes" | "newest"

interface CommunityGridProps {
  communities: CommunityWithStats[]
  selectedTypes: string[]
  searchQuery?: string
  sortBy: SortOption // new prop for sort state
}

export const CommunityGrid: React.FC<CommunityGridProps> = ({ communities, selectedTypes, searchQuery = "", sortBy }) => {
  const filteredAndSortedCommunities = [...communities]
    .filter(community => selectedTypes.length === 0 || selectedTypes.includes(community.type))
    .filter(community => community.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    .sort((a, b) => {
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
    <VoteProvider initialCommunities={communities}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {filteredAndSortedCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
        
        {filteredAndSortedCommunities.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No communities found with selected filters.
          </div>
        )}
      </div>
    </VoteProvider>
  )
}
