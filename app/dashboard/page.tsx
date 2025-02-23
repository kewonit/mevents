"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase/client";
import { Toaster, toast } from "sonner";
import { ProfileHeader } from "@/components/profile-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { instrumentSerif, instrumentSerifItalic, instrumentSans } from "@/utils/fonts";
import { Building2, Clock, ArrowRight } from "lucide-react";
import { MembershipRequestsList } from "@/components/membership-requests-list";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CreateCommunityDialog } from "@/components/create-community-dialog";
import { Community, Topic } from '@/app/utils/db'

interface Profile {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState('communities'); 
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('');
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/topics')
        if (!response.ok) throw new Error('Failed to fetch topics')
        const data = await response.json()
        setTopics(data)
      } catch (error) {
        console.error('Error fetching topics:', error)
        toast.error('Failed to load topics')
      }
    }
    fetchTopics()
  }, [])

  useEffect(() => {
    const fetchCommunities = async () => {
      if (!selectedTopicId) return;
      try {
        const { data, error } = await supabase
          .from('communities')
          .select('*')
          .eq('topic_id', selectedTopicId);

        if (error) throw error;
        setCommunities(data || []);
      } catch (error) {
        console.error('Error fetching communities:', error);
        toast.error('Failed to load communities');
      }
    };

    fetchCommunities();
  }, [selectedTopicId]);

  useEffect(() => {
    setSelectedCommunityId('');
  }, [selectedTopicId]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/');
      router.refresh();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  const navigationItems = [
    { id: 'communities', label: 'My Communities', icon: Building2 },
    { id: 'pending', label: 'Pending Approvals', icon: Clock },
  ];

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-b from-[#f3f1ea] to-[#E5DFD0] p-4 ${instrumentSerif.variable} ${instrumentSerifItalic.variable} ${instrumentSans.variable}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-[300px] w-full rounded-2xl" />
          <div className="h-12 flex gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-full w-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'communities':
      default: // Make communities the default case
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-instrument-serif">My Communities</h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0 sm:mr-2">
                <Select 
                  value={selectedTopicId} 
                  onValueChange={setSelectedTopicId}
                >
                  <SelectTrigger className="w-[200px]">
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
              <CreateCommunityDialog topicId={selectedTopicId} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.length > 0 ? (
                communities.map((community) => (
                  <div
                    key={community.id}
                    className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#DCD5C1] p-6"
                    onClick={() => setSelectedCommunityId(community.id)}
                  >
                    <h3 className="font-instrument-serif text-lg mb-2">{community.name}</h3>
                    {community.description && (
                      <p className="font-instrument-sans text-sm text-gray-600 mb-4">
                        {community.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl border border-[#DCD5C1]">
                  <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-instrument-serif text-lg mb-2">No Communities Yet</h3>
                  <p className="font-instrument-sans text-sm text-gray-600 mb-4">
                    Create or join communities to get started
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="font-instrument-sans"
                    onClick={() => router.push('/topics')}
                  >
                    Browse Communities
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-instrument-serif">Pending Approvals</h2>
              {communities.length > 0 && (
                <Select 
                  value={selectedCommunityId} 
                  onValueChange={setSelectedCommunityId}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a community" />
                  </SelectTrigger>
                  <SelectContent>
                    {communities.map((community) => (
                      <SelectItem key={community.id} value={community.id}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#DCD5C1] p-6">
              {selectedCommunityId ? (
                <MembershipRequestsList communityId={selectedCommunityId} />
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-instrument-serif text-lg mb-2">Select a Community</h3>
                  <p className="font-instrument-sans text-sm text-gray-600">
                    Choose a community to view pending requests
                  </p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#f3f1ea] to-[#E5DFD0] ${instrumentSerif.variable} ${instrumentSerifItalic.variable} ${instrumentSans.variable}`}>
      <Toaster position="top-right" richColors />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8 space-y-12">
        {/* Profile Header with more spacing */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#DCD5C1] opacity-20 rounded-3xl" />
          <div className="relative">
            {profile && <ProfileHeader profile={profile} />}
          </div>
        </div>

        {/* Account Actions Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-[#DCD5C1] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-instrument-serif text-lg">Account Settings</h3>
              <p className="text-sm text-gray-600 font-instrument-sans">Manage your account preferences</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="font-instrument-sans border-red-600 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              Sign out <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation and Content */}
        <div className="space-y-8">
          <nav className="flex items-center gap-2 border-b border-[#DCD5C1]">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-instrument-sans text-sm transition-colors relative
                    ${activeTab === item.id 
                      ? 'text-black border-b-2 border-black' 
                      : 'text-gray-600 hover:text-black'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {renderContent()}
        </div>
      </div>
    </div>
  );
}
