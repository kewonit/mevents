"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase/client";
import { Toaster, toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { instrumentSerif, instrumentSerifItalic, instrumentSans } from "@/utils/fonts";

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const MAX_ATTEMPTS = 3;
const COOLDOWN_TIME = 60;

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [token, setToken] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS) {
      setIsBlocked(true);
      setTimeout(() => {
        setIsBlocked(false);
        setAttempts(0);
      }, COOLDOWN_TIME * 1000);
    }
  }, [attempts]);

  const validateEmail = (email: string): boolean => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      toast.error(`Too many attempts. Please try again in ${COOLDOWN_TIME} seconds.`);
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Removed account existence check to allow login without an account
      /*
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (userError || !user) {
        toast.error("No account found with this email. Please sign up first!");
        return;
      }
      */

      const { error: otpError } = await supabase.auth.signInWithOtp({ 
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (otpError) throw otpError;
      
      setShowVerification(true);
      setCooldown(COOLDOWN_TIME);
      toast.success("Verification code sent successfully!");
      setSuccess(true);
    } catch (err: any) {
      console.error("Login error:", err);
      setAttempts(prev => prev + 1);
      toast.error(err.message || "Failed to send verification code");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      toast.error(`Too many attempts. Please try again in ${COOLDOWN_TIME} seconds.`);
      return;
    }

    if (token.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.toLowerCase().trim(),
        token: token.trim(),
        type: 'email',
      });

      if (error) throw error;

      if (data?.session) {
        try {
          // Check if profile exists and update email if needed
          const { data: existingProfile, error: profileError } = await supabase
            .from('profiles')
            .select('username, email')
            .eq('id', data.session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }

          if (!existingProfile) {
            // Create new profile if doesn't exist
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: data.session.user.id,
                email: email.toLowerCase().trim(),
                username: `user_${data.session.user.id.substring(0, 8)}`,
                updated_at: new Date().toISOString(),
              });

            if (insertError) throw insertError;
            
            router.push('/onboarding');
            router.refresh();
            return;
          }

          // Update email if it's different
          if (existingProfile.email !== email.toLowerCase().trim()) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                email: email.toLowerCase().trim(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', data.session.user.id);

            if (updateError) throw updateError;
          }

          if (!existingProfile.username || existingProfile.username.startsWith('user_')) {
            router.push('/onboarding');
            router.refresh();
            return;
          }

          router.push('/dashboard');
          router.refresh();
        } catch (error) {
          console.error("Profile operation failed:", error);
          router.push('/onboarding');
          router.refresh();
        }
        return;
      }

      throw new Error('Verification failed');
    } catch (err: any) {
      console.error("Verification error:", err);
      setAttempts(prev => prev + 1);
      toast.error(err.message || "Invalid or expired code");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className={`min-h-screen w-full bg-gradient-to-b from-[#f3f1ea] to-[#E5DFD0] flex items-center justify-center py-12 px-4 ${instrumentSerif.variable} ${instrumentSerifItalic.variable} ${instrumentSans.variable}`}>
        <div className="w-full max-w-2xl relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#DCD5C1] opacity-20 rounded-3xl" />
          
          <div className="p-3 sm:p-4 border-2 border-[#DCD5C1] rounded-2xl backdrop-blur-sm bg-white/30 relative z-10">
            <div className="bg-white/95 rounded-xl shadow-sm overflow-hidden border border-[#E5DFD0] relative">
              {/* Ticket effect dots */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 sm:w-4 h-6 sm:h-8 bg-[#f3f1ea] rounded-r-full"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 sm:w-4 h-6 sm:h-8 bg-[#f3f1ea] rounded-l-full"></div>

              <div className="p-6 sm:p-8 bg-gradient-to-br from-white to-gray-50">
                <div className="text-center mb-8">
                  <p className="font-instrument-sans uppercase tracking-[0.51em] leading-[133%] text-[14px] sm:text-[16px] text-gray-800 mb-2">
                    Welcome to Kommodex
                  </p>
                  <p className="text-sm text-gray-600 font-instrument-sans">Your community discovery platform</p>
                </div>

                {error && (
                  <div role="alert" aria-live="assertive" className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                {!showVerification ? (
                  <form onSubmit={handleSendEmail} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-instrument-sans">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-[#DCD5C1] rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white font-instrument-sans"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="border-t-2 border-dashed border-[#E5DFD0] my-6"></div>

                    <button
                      type="submit"
                      disabled={loading || cooldown > 0}
                      className="w-full py-3 text-base font-medium bg-black hover:bg-black/90 text-white transition-all duration-300 rounded-lg flex items-center justify-between px-6 group disabled:opacity-50 disabled:cursor-not-allowed font-instrument-sans"
                    >
                      <span>{loading ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Send Code"}</span>
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyToken} className="space-y-6">
                    {success && (
                      
                      <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100">
                        <p className="font-medium">Check your inbox!</p>
                        <p className="text-sm mt-1">We&apos;ve sent a code to {email}</p>
                        <p className="text-xs sm:text-sm text-yellow-800 mt-3 sm:mt-2">
                              It might take upto 15-30 seconds for the email to arrive!
                        </p>
                      </div>
                    )}
                    <div>
                      <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-3">
                        Verification Code
                      </label>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={token}
                          onChange={(value) => setToken(value)}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    <div className="border-t-2 border-dashed border-gray-200 my-6"></div>

                    <button
                      type="submit"
                      disabled={loading || token.length !== 6}
                      className="w-full py-3 text-base font-medium bg-black hover:bg-black/90 text-white transition-all duration-300 rounded-lg flex items-center justify-between px-6 group disabled:opacity-50 disabled:cursor-not-allowed font-instrument-sans"
                    >
                      <span>{loading ? "Verifying..." : "Verify Code"}</span>
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>

                    <div className="flex flex-col gap-2 text-center">
                      <button
                        type="button"
                        onClick={() => setShowVerification(false)}
                        className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        ← Use a different email
                      </button>
                      <button
                        type="button"
                        onClick={handleSendEmail}
                        disabled={loading || cooldown > 0}
                        className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors"
                      >
                        {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
          
          {/* Optional: Add subtle decorative circles */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#DCD5C1] rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#DCD5C1] rounded-full opacity-20 blur-3xl" />
        </div>
      </div>
    </>
  );
}