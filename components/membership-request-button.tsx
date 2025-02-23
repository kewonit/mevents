'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function MembershipRequestButton({ communityId }: { communityId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleJoinRequest = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/communities/${communityId}/join`, {
        method: 'POST',
      })
      
      if (!response.ok) throw new Error('Failed to request membership')
      
      toast.success('Membership request sent successfully')
      router.refresh()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleJoinRequest}
      disabled={loading}
      className="font-instrument-sans"
    >
      {loading ? 'Requesting...' : 'Request to Join'}
    </Button>
  )
}
