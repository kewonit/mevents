"use client"

import { cn } from "@/lib/utils"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { VoteType } from "../utils/db"
import { Button } from "@/components/ui/button"

interface VoteButtonProps {
  communityId: string
  upvotes: number
  downvotes: number
  userVote?: VoteType | null
  className?: string
}

export function VoteButton({ communityId, upvotes, downvotes, userVote, className }: VoteButtonProps) {
  const router = useRouter()

  const handleVote = async (voteType: VoteType) => {
    try {
      const response = await fetch('/api/communities/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ communityId, voteType }),
      })

      if (!response.ok) {
        const error = await response.json()
        if (response.status === 401) {
          toast.error("Please sign in to vote")
          return
        }
        throw new Error(error.message)
      }

      router.refresh()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to register vote")
    }
  }

  return (
    <div className={cn("flex rounded-lg overflow-hidden h-9 border shadow-sm", className)}>
      <Button
        variant="ghost"
        className={cn(
          "flex-1 px-3 h-full rounded-none border-r",
          "bg-green-50/80 hover:bg-green-100/60 text-green-700",
          userVote === 'upvote' && "bg-green-100 text-green-800",
        )}
        onClick={() => handleVote('upvote')}
      >
        <ArrowUpIcon className="h-4 w-4 mr-1" />
        <span className="font-medium">{upvotes}</span>
      </Button>
      <Button
        variant="ghost"
        className={cn(
          "flex-1 px-3 h-full rounded-none",
          "bg-red-50/80 hover:bg-red-100/60 text-red-700",
          userVote === 'downvote' && "bg-red-100 text-red-800",
        )}
        onClick={() => handleVote('downvote')}
      >
        <ArrowDownIcon className="h-4 w-4 mr-1" />
        <span className="font-medium">{downvotes}</span>
      </Button>
    </div>
  )
}
