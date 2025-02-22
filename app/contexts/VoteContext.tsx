'use client'

import { CommunityWithStats, VoteType } from "@/app/utils/db"
import { createContext, useContext, useCallback, useReducer, ReactNode } from "react"

type VoteState = {
  [key: string]: {
    upvotes: number
    downvotes: number
    userVote: VoteType | null
  }
}

type VoteAction = {
  type: 'UPDATE_VOTE'
  communityId: string
  previousVote: VoteType | null
  newVote: VoteType | null
}

const VoteContext = createContext<{
  votes: VoteState
  updateVote: (communityId: string, previousVote: VoteType | null, newVote: VoteType | null) => void
} | null>(null)

function voteReducer(state: VoteState, action: VoteAction): VoteState {
  if (action.type === 'UPDATE_VOTE') {
    const { communityId, previousVote, newVote } = action
    const current = state[communityId]

    const updatedVotes = { ...current }

    // Remove previous vote if it exists
    if (previousVote) {
      if (previousVote === 'upvote') updatedVotes.upvotes--
      if (previousVote === 'downvote') updatedVotes.downvotes--
    }

    // Add new vote if it exists
    if (newVote) {
      if (newVote === 'upvote') updatedVotes.upvotes++
      if (newVote === 'downvote') updatedVotes.downvotes++
    }

    updatedVotes.userVote = newVote

    return {
      ...state,
      [communityId]: updatedVotes
    }
  }
  return state
}

export function VoteProvider({ 
  children,
  initialCommunities 
}: { 
  children: ReactNode
  initialCommunities: CommunityWithStats[]
}) {
  // Initialize state from communities
  const initialState: VoteState = {}
  initialCommunities.forEach(community => {
    initialState[community.id] = {
      upvotes: community.upvotes,
      downvotes: community.downvotes,
      userVote: community.user_vote || null
    }
  })

  const [votes, dispatch] = useReducer(voteReducer, initialState)

  const updateVote = useCallback((
    communityId: string,
    previousVote: VoteType | null,
    newVote: VoteType | null
  ) => {
    dispatch({ type: 'UPDATE_VOTE', communityId, previousVote, newVote })
  }, [])

  return (
    <VoteContext.Provider value={{ votes, updateVote }}>
      {children}
    </VoteContext.Provider>
  )
}

export const useVotes = () => {
  const context = useContext(VoteContext)
  if (!context) throw new Error('useVotes must be used within a VoteProvider')
  return context
}
