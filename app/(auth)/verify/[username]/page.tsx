'use client';

import { verifySchema } from '@/app/Schema/verifySchema';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { motion } from 'framer-motion';
import { ShieldCheck, KeyRound, ArrowRight, Fingerprint } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const params = useParams();
  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    }
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post('/api/verify', {
        username: params.username,
        code: data.code,
      });

      if (response.data.success) {
        toast.success("Identity Verified. Access Granted.");
        router.push('/sign-in');
      } else {
        toast.error(response.data.message || "Invalid code.");
      }
    } catch (error) {
      toast.error("Verification failed. Please check the code.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(79,70,229,0.1)]"
          >
            <ShieldCheck className="text-indigo-400" size={32} />
          </motion.div>
          
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
            Identity Check
          </h1>
          <p className="text-slate-400 text-balance px-4">
            We've sent a secure code to your abyss. Enter it below to proceed.
          </p>
        </div>

        <div className="relative">
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />
          
          <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 flex items-center gap-2 mb-2">
                        <KeyRound size={14} className="text-indigo-400" /> Verification Code
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="000000"
                          className="bg-white/[0.03] border-white/10 text-white text-center text-2xl tracking-[0.5em] font-mono h-16 rounded-2xl focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-700"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-400 text-xs text-center mt-2" />
                    </FormItem>
                  )}
                />

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type='submit' 
                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3 transition-all"
                  >
                    Confirm Identity <ArrowRight size={20} />
                  </Button>
                </motion.div>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => toast.info("Check your spam folder!")}
                className="text-slate-500 text-sm hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <Fingerprint size={14} /> Didn't receive a code? Resend
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}