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

            {/* Main Content - Reorganized layout */}
            <div className="space-y-6">
              {/* Title section next to logo */}
              <div className="ml-40 flex justify-between items-start">
                <h3 className="font-instrument-serif text-3xl text-gray-900 tracking-tight font-bold">
                  {community.name}
                </h3>
                <Badge 
                  className="bg-blue-50 text-blue-600 hover:bg-blue-50 px-4 py-2 text-base rounded-lg flex items-center gap-2"
                >
                  <Users2Icon className="w-5 h-5" />
                  <span className="font-semibold">{community.member_count}</span> members
                </Badge>
              </div>

              {/* Description below logo */}
              <div className="mt-4">
                {community.description && (
                  <p className="font-instrument-serif text-base text-gray-600 leading-relaxed max-w-3xl">
                    {community.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Vote Stats + Button Section */}
          <div className="mt-auto">
            {/* Vote Stats */}
            <div className="flex justify-end gap-3 px-6 py-3 border-t border-gray-200">
              <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                <ArrowUpIcon className="h-5 w-5" />
                <span className="font-bold">{community.upvotes}</span>
              </span>
              <span className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                <ArrowDownIcon className="h-5 w-5" />
                <span className="font-bold">{community.downvotes}</span>
              </span>
            </div>

            {/* Join Button */}
            <div className="border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full rounded-none h-12 bg-[#EBE9E0]/50 hover:bg-[#EBE9E0] border-0 text-gray-700 hover:text-gray-900 font-bold"
              >
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
