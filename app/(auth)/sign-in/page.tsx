'use client';

import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@/app/Schema/signInSchema';
import { signIn } from 'next-auth/react';
import z from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LockKeyhole, User, ArrowRight } from 'lucide-react';

export default function SignInPage() {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    }
  });

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const response = await signIn('credentials', {
        identifier: data.username,
        password: data.password,
        redirect: false,
      });

      if (response?.error) {
        toast.error("Invalid credentials. Try again.");
      }

      if (response?.url) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[150px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-white mb-3"
          >
            Welcome Back
          </motion.h1>
          <p className="text-slate-400">Continue your secret conversations.</p>
        </div>

        <div className="relative group">
          {/* Card Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 flex items-center gap-2">
                        <User size={14} className="text-indigo-400" /> Username / Email
                      </FormLabel>
                      <Input 
                        {...field} 
                        className="bg-white/5 border-white/10 text-white focus:ring-indigo-500/50 focus:border-indigo-500 h-12 rounded-xl transition-all"
                        placeholder="yourname"
                      />
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-slate-300 flex items-center gap-2">
                          <LockKeyhole size={14} className="text-indigo-400" /> Password
                        </FormLabel>
                        <Link href="#" className="text-xs text-indigo-400 hover:underline">Forgot?</Link>
                      </div>
                      <Input 
                        type="password" 
                        {...field} 
                        className="bg-white/5 border-white/10 text-white focus:ring-indigo-500/50 focus:border-indigo-500 h-12 rounded-xl transition-all"
                        placeholder="••••••••"
                      />
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all" 
                    type="submit"
                  >
                    Sign In <ArrowRight size={18} />
                  </Button>
                </motion.div>
              </form>
            </Form>

            <div className="text-center mt-8 pt-6 border-t border-white/5">
              <p className="text-slate-400 text-sm">
                Not a member yet?{' '}
                <Link href="/sign-up" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}