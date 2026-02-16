'use client';

import z from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from 'usehooks-ts';
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, User, Mail, Lock, CheckCircle2, XCircle, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signUpSchema } from "@/app/Schema/signUpSchema";
import { motion, AnimatePresence } from "framer-motion";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const [debouncedUsername] = useDebounceValue(username, 300);
  
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    }
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios(`/api/check-username-unique?username=${debouncedUsername}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<any>;
          setUsernameMessage(axiosError.response?.data?.message || "Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsername();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/sign-up', data);
      if (response.data.success) {
        toast.success("Account created! Check your email for the code.");
        router.push(`/verify/${username}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred during sign-up.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs mb-4"
          >
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tighter text-white">Join Talkie</h1>
          <p className="text-slate-400 mt-2">Claim your anonymous handle in the abyss.</p>
        </div>

        <div className="relative group">
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000" />
          
          <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Username with Status Check */}
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 flex items-center gap-2">
                        <User size={14} className="text-indigo-400" /> Username
                      </FormLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          className="bg-white/[0.03] border-white/10 text-white focus:ring-2 focus:ring-indigo-500/40 h-12 rounded-xl placeholder:text-slate-600 transition-all"
                          placeholder="shadow_walker"
                          onChange={(e) => {
                            field.onChange(e);
                            setUsername(e.target.value);
                          }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {isCheckingUsername && <Loader2 className="animate-spin text-indigo-400" size={18} />}
                        </div>
                      </div>
                      
                      <AnimatePresence mode="wait">
                        {usernameMessage && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`text-[11px] mt-1.5 flex items-center gap-1 font-medium ${
                              usernameMessage === 'Username is unique' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {usernameMessage === 'Username is unique' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                            {usernameMessage}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <FormMessage className="text-rose-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 flex items-center gap-2">
                        <Mail size={14} className="text-indigo-400" /> Email
                      </FormLabel>
                      <Input 
                        {...field} 
                        className="bg-white/[0.03] border-white/10 text-white focus:ring-2 focus:ring-indigo-500/40 h-12 rounded-xl placeholder:text-slate-600 transition-all"
                        placeholder="ghost@void.com"
                      />
                      <p className='text-[10px] text-slate-500 uppercase tracking-widest mt-1'>Verification code will follow</p>
                      <FormMessage className="text-rose-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 flex items-center gap-2">
                        <Lock size={14} className="text-indigo-400" /> Password
                      </FormLabel>
                      <Input 
                        type="password" 
                        {...field} 
                        className="bg-white/[0.03] border-white/10 text-white focus:ring-2 focus:ring-indigo-500/40 h-12 rounded-xl placeholder:text-slate-600 transition-all"
                        placeholder="••••••••"
                      />
                      <FormMessage className="text-rose-400 text-xs" />
                    </FormItem>
                  )}
                />

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    className='w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50' 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={18} />
                        Initializing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Create Account <ArrowRight size={18} />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>

            <div className="text-center mt-8 pt-6 border-t border-white/5">
              <p className="text-slate-400 text-sm">
                Already part of the void?{' '}
                <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUpPage;