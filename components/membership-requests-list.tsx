'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, XCircle } from 'lucide-react'

interface MembershipRequest {
  id: string
  status: string
  created_at: string
  profiles: {
    username: string
    avatar_url: string | null
  }
}

export function MembershipRequestsList({ communityId }: { communityId: string }) {
  const [requests, setRequests] = useState<MembershipRequest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch(`/api/communities/${communityId}/memberships`)
      if (!response.ok) throw new Error('Failed to fetch requests')
      const data = await response.json()
      setRequests(data.filter((r: MembershipRequest) => r.status === 'pending'))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [communityId])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleRequest = async (membershipId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/communities/${communityId}/memberships`, {
        method: 'PATCH',
        body: JSON.stringify({ membershipId, status }),
      })
      
      if (!response.ok) throw new Error('Failed to update request')
      
      toast.success(`Request ${status} successfully`)
      fetchRequests()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (requests.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="font-instrument-serif text-lg">Pending Requests</h3>
      <div className="space-y-2">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#DCD5C1]"
          >
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={request.profiles.avatar_url || ''} />
                <AvatarFallback>
                  {request.profiles.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-instrument-sans">{request.profiles.username}</p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => handleRequest(request.id, 'approved')}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => handleRequest(request.id, 'rejected')}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
