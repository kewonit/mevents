import { CommunityWithStats } from "@/app/utils/db"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, ArrowDownIcon, Users2Icon } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface CommunityCardProps {
  community: CommunityWithStats
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <div className="group">
      <div className="bg-[#EBE9E0]/40 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col relative">
        {/* Community Type Badge - New vertical badge */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-[#EBE9E0] flex items-center justify-center z-10 border-r border-gray-200">
          <div className="rotate-180 whitespace-nowrap [writing-mode:vertical-lr] text-gray-600 font-medium tracking-wide uppercase text-sm">
            {community.type}
          </div>
        </div>

        {/* Main Content Wrapper - added left margin for type badge */}
        <div className="ml-20 flex-1 flex flex-col">
          {/* Banner Section */}
          <div className="relative w-full h-48">
            {community.banner_url ? (
              <Image
                src={community.banner_url}
                alt={community.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#EBE9E0] to-[#e0d8c3] flex items-center justify-center">
                <span className="text-gray-400">No banner image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
          </div>

          {/* Content Section */}
          <div className="relative p-8 pb-16">
            {/* Logo/Avatar */}
            <div className="absolute -top-20 left-8">
              <div className="rounded-2xl overflow-hidden border-4 border-white shadow-lg w-32 h-32">
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

            {/* Main Content */}
            <div className="ml-40 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {community.name}
                </h3>
              </div>
              {community.description && (
                <p className="text-gray-600 text-sm max-w-2xl">
                  {community.description}
                </p>
              )}
              <div className="flex items-center gap-6">
                <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50">
                  <Users2Icon className="w-4 h-4 mr-1" />
                  {community.member_count} members
                </Badge>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-green-600">
                    <ArrowUpIcon className="h-4 w-4" />
                    {community.upvotes}
                  </span>
                  <span className="flex items-center gap-1 text-red-600">
                    <ArrowDownIcon className="h-4 w-4" />
                    {community.downvotes}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Button Section */}
          <div className="mt-auto border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full rounded-none h-12 bg-[#EBE9E0]/50 hover:bg-[#EBE9E0] border-0 text-gray-700 hover:text-gray-900"
            >
              Join Community
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
