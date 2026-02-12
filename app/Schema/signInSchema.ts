import { PassThrough } from 'stream';
import {z} from 'zod';

export const signInSchema = z.object({
    username: z.string(),
    password: z.string()
})