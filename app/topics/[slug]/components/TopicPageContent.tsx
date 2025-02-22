"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommunityGrid } from './CommunityGrid'
import { CommunityWithStats } from '@/app/utils/db'

const COMMUNITY_TYPES = ['reddit', 'discord', 'forum', 'telegram', 'matrix', 'custom'] as const

interface TopicPageContentProps {
  topicData: {
    name: string
    description: string | null
  }
  communities: CommunityWithStats[]
  votesCount: number
}

export function TopicPageContent({ topicData, communities, votesCount }: TopicPageContentProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  return (
    <div className="flex flex-col lg:flex-row min-h-screen pt-16">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/3 bg-[#f3f1ea] p-4 lg:p-8 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] -mt-16 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="space-y-4 lg:space-y-6 pt-20 lg:pt-0">
          <Link href="/topics">
            <Button variant="ghost" className="bg-white/60 hover:bg-white/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Topics
            </Button>
          </Link>
          
          {/* Topic Info Card */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 space-y-4">
            <h1 className="font-instrument-serif text-4xl text-gray-900">
              {topicData.name}
            </h1>
            <p className="text-gray-600">
              {topicData.description}
            </p>
          </div>
          
          {/* Stats Card */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl">
                <div className="text-2xl font-bold">{communities?.length || 0}</div>
                <div className="text-sm text-gray-500">Communities</div>
              </div>
              <div className="bg-white p-4 rounded-xl">
                <div className="text-2xl font-bold">{votesCount}</div>
                <div className="text-sm text-gray-500">Total Votes</div>
              </div>
              <div className="bg-white p-4 rounded-xl col-span-2">
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-US').format(
                    communities.reduce((acc, community) => acc + community.member_count, 0)
                  )}
                </div>
                <div className="text-sm text-gray-500">Total Members</div>
              </div>
            </div>
          </div>

          {/* Type Filter Card */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Filter by Type</h3>
            <div className="overflow-y-auto max-h-[160px] pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="grid grid-cols-2 gap-2">
                {COMMUNITY_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedTypes(prev =>
                        prev.includes(type)
                          ? prev.filter(t => t !== type)
                          : [...prev, type]
                      )
                    }}
                    className={`p-2 rounded-xl border transition-colors ${
                      selectedTypes.includes(type)
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                        : 'bg-white/50 border-gray-200 text-gray-600 hover:bg-white/80'
                    }`}
                  >
                    <div className="text-sm capitalize">{type}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full lg:w-2/3 p-4 lg:p-8">
        <div className="space-y-6 lg:space-y-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-8">
            <h2 className="font-instrument-serif text-2xl text-gray-900 mb-6">
              Communities
            </h2>
            <CommunityGrid 
              communities={communities} 
              selectedTypes={selectedTypes}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
