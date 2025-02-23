'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Community, CommunityType, Topic } from '@/app/utils/db'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CreateCommunityDialogProps {
  onCommunityCreated?: (community: Community) => void;
}

export function CreateCommunityDialog({ onCommunityCreated }: CreateCommunityDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<CommunityType>('forum');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [loadingTopics, setLoadingTopics] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      if (!open) return; // Only fetch when dialog opens
      setLoadingTopics(true);
      try {
        const response = await fetch('/api/topics');
        if (!response.ok) throw new Error('Failed to fetch topics');
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error('Error fetching topics:', error);
        toast.error('Failed to load topics');
      } finally {
        setLoadingTopics(false);
      }
    };

    if (open) {
      fetchTopics();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTopicId) {
      toast.error('Please select a topic');
      return;
    }

    if (!name.trim()) {
      toast.error('Community name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          type,
          topicId: selectedTopicId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create community');
      }

      toast.success('Community created successfully');
      onCommunityCreated?.(data);
      setOpen(false);
      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setType('forum');
    setSelectedTopicId('');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-instrument-sans">
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new community</DialogTitle>
          <DialogDescription>
            Create your community and start building your tribe. Your community will be reviewed by our moderators before being made public.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Select
              value={selectedTopicId}
              onValueChange={setSelectedTopicId}
              disabled={loadingTopics}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter community name"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter community description"
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as CommunityType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="forum">Forum</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
                <SelectItem value="reddit">Reddit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={loading || !name.trim()} // Remove !topicId condition since we already validate in handleSubmit
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
