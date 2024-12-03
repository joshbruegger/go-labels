import { z } from 'zod';

export const responseSchema = z.object({
	submission_id: z.string(),
	question_id: z.string(),
	choice_id: z.string()
});

export type ResponseSchema = typeof responseSchema;
