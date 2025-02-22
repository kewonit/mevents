export type CommunityType = 'reddit' | 'discord' | 'forum' | 'other'
export type VoteType = 'upvote' | 'downvote'

export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface Topic {
  id: string // UUID is stored as string in TypeScript
  name: string
  description: string | null
  icon_url: string | null
  created_at: string // ISO date string
}

export interface TopicWithStats extends Topic {
  total_members: number
  total_communities: number
  total_votes: number
}

export interface Community {
  id: string
  topic_id: string
  name: string
  description: string | null
  type: CommunityType
  banner_url: string | null
  logo_url: string | null
  external_url: string | null
  member_count: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface CommunityVote {
  community_id: string
  profile_id: string
  vote_type: VoteType
  created_at: string
}

export interface CommunityWithStats extends Community {
  upvotes: number
  downvotes: number
  vote_score: number
  user_vote?: VoteType | null
}

// Database helper types
export type Tables = {
  profiles: Profile
  topics: Topic
  communities: Community
  community_votes: CommunityVote
}

export type Views = {
  community_stats_mv: CommunityWithStats
}

export type Database = {
  public: {
    Tables: Tables
    Views: Views
  }
}