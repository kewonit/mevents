"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase/client";
import { Toaster, toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { instrumentSerif, instrumentSerifItalic, instrumentSans } from "@/utils/fonts";

export function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: username.trim(),
          bio: bio.trim() || null,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        if (error.code === '23505') {
          toast.error("This username is already taken");
          return;
        }
        throw error;
      }

      toast.success("Profile created successfully!");
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className={`min-h-screen w-full bg-gradient-to-b from-[#f3f1ea] to-[#E5DFD0] flex items-center justify-center py-12 px-4 ${instrumentSerif.variable} ${instrumentSerifItalic.variable} ${instrumentSans.variable}`}>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-[#DCD5C1]">
            <div className="text-center mb-8">
              <p className="font-instrument-sans uppercase tracking-[0.51em] leading-[133%] text-[14px] sm:text-[16px] text-gray-800 mb-2">
                Complete Your Profile
              </p>
              <p className="text-sm text-gray-600 font-instrument-sans">
                Tell us a little about yourself
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 font-instrument-sans">
                  Username*
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="font-instrument-sans"
                  placeholder="Choose a unique username"
                  required
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1 font-instrument-sans">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="font-instrument-sans"
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-instrument-sans"
              >
                {loading ? "Creating Profile..." : "Complete Setup"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
