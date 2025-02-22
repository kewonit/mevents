"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase/client";
import { OnboardingForm } from "@/components/onboarding-form";

export default function OnboardingPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }

      // Check if profile already exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single();

      if (profile?.username) {
        router.push('/dashboard');
        return;
      }

      setUserId(session.user.id);
    };

    checkAuth();
  }, [router]);

  if (!userId) return null;

  return <OnboardingForm userId={userId} />;
}
