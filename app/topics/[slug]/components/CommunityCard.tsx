import { CommunityWithStats } from "@/app/utils/db"
import { Badge } from "@/components/ui/badge"
import { Users2Icon, ExternalLink, Globe } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { VoteButton } from "@/app/components/VoteButton"

interface CommunityCardProps {
  community: CommunityWithStats
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <div className="group">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col relative hover:shadow-lg">
        {/* Community Type Badge */}
        <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 bg-[#f8f7f4] flex items-center justify-center z-10 border-r border-gray-100">
          <div className="rotate-180 whitespace-nowrap [writing-mode:vertical-lr] text-gray-500 font-medium tracking-wider uppercase text-xs">
            {community.type}
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-6 sm:ml-8 flex-1 flex flex-col">
          {/* Banner Section */}
          <div className="relative w-full h-24 sm:h-28 bg-gradient-to-r from-gray-50 to-gray-100">
            {community.banner_url ? (
              <Image
                src={community.banner_url}
                alt={community.name}
                fill
                className="object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />
          </div>

          {/* Content Area */}
          <div className="relative px-3 sm:px-5 pt-12 pb-4">
            {/* Logo */}
            <div className="absolute -top-10 sm:-top-12 left-0">
              <div className="rounded-xl overflow-hidden border-2 border-white shadow-md w-20 h-20 sm:w-24 sm:h-24 bg-white">
                {community.logo_url ? (
                  <Image
                    src={community.logo_url}
                    alt={community.name}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#EBE9E0] flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400">
                      {community.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Header Section */}
            <div className="ml-24 sm:ml-28 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-3">
              <div>
                <h3 className="font-instrument-serif text-xl sm:text-2xl text-gray-900 font-bold leading-tight">
                  {community.name}
                </h3>
                {community.external_url && (
                  <a 
                    href={community.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mt-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Visit Community
                  </a>
                )}
              </div>
              <Badge 
                className="bg-blue-50/80 text-blue-600 px-2 sm:px-3 py-1 sm:py-1.5 text-sm rounded-lg flex items-center gap-1.5 hover:bg-blue-50 transition-colors self-start"
              >
                <Users2Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {new Intl.NumberFormat('en-US').format(community.member_count)}
              </Badge>
            </div>

            {/* Description */}
            {community.description && (
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
                {community.description}
              </p>
            )}

            {/* Stats Bar */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto gap-2">
              <VoteButton
                communityId={community.id}
                upvotes={community.upvotes}
                downvotes={community.downvotes}
                userVote={community.user_vote}
              />
              <a
                href={community.external_url || '#'}
                target={community.external_url ? "_blank" : undefined}
                rel={community.external_url ? "noopener noreferrer" : undefined}
                className="block"
              >
                <Button
                  variant="outline"
                  className="h-8 px-3 sm:px-4 bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 font-medium rounded-lg text-sm sm:text-base whitespace-nowrap"
                >
                  Join Community
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
