import {z} from 'zod';

export const UsernameValidation = z.string().min(3, 'Username must be at least 3 characters long').max(20, 'Username cannot exceed 20 characters');

export const signUpSchema = z.object({
    username: UsernameValidation,
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long')
})