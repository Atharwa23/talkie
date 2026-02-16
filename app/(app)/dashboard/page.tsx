'use client';

import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Message } from '@/app/models/User';
import { ApiResponse } from '@/app/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Copy, Share2, Inbox } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { use, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { acceptMessageSchema } from '@/app/Schema/acceptMessageSchema';
import { motion, AnimatePresence } from 'framer-motion';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Sync Error', {
        description: axiosError.response?.data.message ?? 'Failed to fetch settings',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) toast.success('Inbox Updated');
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error('Fetch Error', {
          description: axiosError.response?.data.message ?? 'Failed to fetch messages',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Update Failed', {
        description: axiosError.response?.data.message ?? 'Failed to update settings',
      });
    }
  };

  if (!session || !session.user) return null;

  const { username } = session.user as User;
  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/u/${username}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success('Link Copied', { description: 'Share it to receive anonymous whispers.' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 pb-20">
      {/* Top Header Section */}
      <div className="relative border-b border-white/5 bg-white/[0.02] backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Inbox className="text-indigo-400" size={28} /> Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage your identity and incoming whispers.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${acceptMessages ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                <span className={`text-xs font-bold uppercase tracking-widest ${acceptMessages ? 'text-indigo-400' : 'text-rose-400'}`}>
                  {acceptMessages ? 'Live' : 'Paused'}
                </span>
                <Switch
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                />
             </div>
             <Button 
                variant="outline" 
                size="icon" 
                onClick={() => fetchMessages(true)}
                className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white"
              >
               {isLoading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCcw size={18} />}
             </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        
        {/* URL Sharing Card */}
        <section className="relative group mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                <Share2 size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white mb-1">Your Public Gateway</h2>
                <p className="text-sm text-slate-400">Share this link with your audience to receive anonymous feedback.</p>
                <div className="mt-4 flex items-center gap-2">
                   <code className="flex-1 bg-black/40 border border-white/5 px-4 py-3 rounded-xl text-indigo-300 font-mono text-sm truncate">
                     {profileUrl}
                   </code>
                   <Button onClick={copyToClipboard} className="bg-indigo-600 hover:bg-indigo-500 h-12 px-6 rounded-xl shrink-0">
                     <Copy size={16} className="mr-2" /> Copy
                   </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
             Recent Messages <span className="bg-white/10 text-xs py-1 px-2 rounded-lg text-slate-400">{messages.length}</span>
          </h3>
        </div>

        <AnimatePresence mode="popLayout">
          {messages.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {messages.map((message, index) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MessageCard
                    message={message}
                    onMessageDelete={(id) => setMessages(prev => prev.filter(m => m._id !== id))}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl"
            >
              <Inbox className="text-slate-700 mb-4" size={48} />
              <p className="text-slate-500 font-medium">No messages found in the void.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default UserDashboard;