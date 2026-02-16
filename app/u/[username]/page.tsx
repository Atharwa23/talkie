'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send, Sparkles, MessageSquare, UserPlus, Zap } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { messageSchema } from '@/app/Schema/messageSchema';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useCompletion } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';

const parseStringMessages = (str: string): string[] => {
  if (!str) return [];
  return str.split('||');
};

export default function SendMessage() {
  const [isLoading, setIsLoading] = useState(false);
  const username = useParams().username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" }
  });

  const { complete, completion, isLoading: isSuggestLoading, error } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: "What's a secret you've never told anyone?||If you could change one thing about today, what would it be?||What's the best advice you've ever received?"
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/send-message', {
        content: data.content,
        username
      });
      toast.success("Whisper sent into the void.");
      form.reset({ content: '' });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "The void is closed right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 py-12 px-4 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto z-10 relative"
      >
        <header className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent mb-4"
          >
            Send a Whisper
          </motion.h1>
          <p className="text-indigo-400 font-medium tracking-widest uppercase text-xs">
            To @{username}
          </p>
        </header>

        <section className="relative group">
          {/* Form Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 group-focus-within:opacity-100 transition-opacity" />
          
          <div className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-400 text-sm flex items-center gap-2 mb-2">
                        <MessageSquare size={14} /> Your Anonymous Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type something meaningful..."
                          className="bg-white/5 border-white/10 text-white min-h-[150px] rounded-2xl focus:ring-2 focus:ring-indigo-500/30 resize-none text-lg leading-relaxed placeholder:text-slate-700 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-rose-400 text-xs" />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-center">
                  <Button 
                    type="submit" 
                    disabled={isLoading || !messageContent}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 h-14 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : <><Send size={18} className="mr-2" /> Send It</>}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </section>

        {/* AI Suggestions Section */}
        <section className="mt-16 space-y-8">
          <div className="flex items-center justify-between px-2">
             <div className="space-y-1">
               <h3 className="text-xl font-semibold text-white">Need Inspiration?</h3>
               <p className="text-sm text-slate-500">Click a thought to fill your message.</p>
             </div>
             <Button
                variant="outline"
                onClick={() => complete('')}
                disabled={isSuggestLoading}
                className="rounded-xl border-indigo-500/20 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
              >
                {isSuggestLoading ? <Loader2 className="animate-spin" size={16} /> : <><Sparkles size={16} className="mr-2" /> Suggest</>}
              </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {parseStringMessages(completion).map((message, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleMessageClick(message)}
                  className="text-left p-5 rounded-2xl border border-white/5 bg-white/[0.02] text-slate-300 hover:border-indigo-500/30 transition-all group"
                >
                  <span className="text-indigo-500 mr-3 opacity-50 group-hover:opacity-100">“</span>
                  {message}
                  <span className="text-indigo-500 ml-1 opacity-50 group-hover:opacity-100">”</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <Separator className="my-16 bg-white/5" />

        {/* CTA Section */}
        <footer className="text-center pb-12">
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 p-8 rounded-3xl border border-white/5">
            <h4 className="text-lg font-semibold text-white mb-2">Want your own secret board?</h4>
            <p className="text-slate-400 mb-6 text-sm">Join the void and let people talk to you anonymously.</p>
            <Link href="/sign-up">
              <Button className="bg-white text-black hover:bg-slate-200 rounded-xl font-bold px-8 h-12">
                <UserPlus size={18} className="mr-2" /> Create Your Account
              </Button>
            </Link>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}