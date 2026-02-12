'use client'
import { verifySchema } from '@/app/Schema/verifySchema';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';


export default function VerifyPage() {
    const router = useRouter(); 
    const params = useParams();
    const form = useForm({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data : z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post('/api/verify', {
                username: params.username,
                code: data.code,
            });
            
            if(response.data.success) {
                toast.success("Verification successful! You can now sign in.");
                router.push('/sign-in');
            } else {
                console.error("Verification failed:", response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred during verification. Please try again.");
            console.error("Verification error:", error);
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify Your Account
                </h1>
                <p className="mb-4">Enter the verification code sent to your email</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <FormField
                        name="code"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit'>Verify Code</Button>
                </form>
            </Form>
        </div>
    </div>
  )
}
