import { CommunityWithStats } from "@/app/utils/db"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, ArrowDownIcon, Users2Icon, ExternalLinkIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CommunityCardProps {
  community: CommunityWithStats
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {community.banner_url && (
        <div className="relative h-32 w-full">
          <Image
            src={community.banner_url}
            alt={community.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <CardHeader className="flex flex-row items-center gap-4">
        {community.logo_url && (
          <Image
            src={community.logo_url}
            alt={community.name}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
        <div>
          <h3 className="font-instrument-serif text-xl font-semibold">{community.name}</h3>
          <Badge variant="outline" className="capitalize">{community.type}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {community.description && (
          <p className="text-sm text-gray-600">{community.description}</p>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Users2Icon className="h-4 w-4 text-gray-500" />
              {community.member_count}
            </span>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-green-600">
                <ArrowUpIcon className="h-4 w-4" />
                {community.upvotes}
              </span>
              <span className="flex items-center text-red-600">
                <ArrowDownIcon className="h-4 w-4" />
                {community.downvotes}
              </span>
            </div>
          </div>
          
          {community.external_url && (
            <Link
              href={community.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Visit
              <ExternalLinkIcon className="h-4 w-4" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
