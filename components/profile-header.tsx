"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/app/utils/supabase/client";
import { toast } from "sonner";
import { User, PenSquare, Save, X } from "lucide-react";

interface ProfileHeaderProps {
  profile: {
    id: string;
    username: string | null;
    avatar_url: string | null;
    bio: string | null;
  };
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile.username || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
      <div className="relative h-32 sm:h-48 bg-gradient-to-r from-[#EBE9E0] to-[#DCD5C1]">
        <div className="absolute -bottom-12 left-8 p-1.5 bg-white rounded-full">
          <div className="w-24 h-24 rounded-full bg-[#EBE9E0] flex items-center justify-center">
            <User className="w-12 h-12 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="pt-16 px-8 pb-8">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1 flex-1">
            {isEditing ? (
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-2xl font-bold max-w-md"
                placeholder="Enter username"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.username || 'Anonymous User'}
              </h1>
            )}
            <p className="text-sm text-gray-500">Member since {new Date(profile.created_at).toLocaleDateString()}</p>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <PenSquare className="w-4 h-4 mr-1" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {isEditing ? (
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="max-w-2xl"
            placeholder="Tell us about yourself..."
            rows={3}
          />
        ) : (
          <p className="text-gray-600 max-w-2xl">
            {profile.bio || 'No bio provided yet.'}
          </p>
        )}
      </div>
    </div>
  );
}
