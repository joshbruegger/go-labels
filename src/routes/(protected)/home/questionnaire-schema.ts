import { z } from 'zod';

// Define the questionnaire schema
export const questionnaireSchema = z.object({
	username: z.string().min(2).max(50)
});

export type QuestionnaireSchema = typeof questionnaireSchema;

// export const appwriteDocumentSchema = z.object({
// 	$id: z.string(),
// 	$collectionId: z.string(),
// 	$databaseId: z.string(),
// 	$createdAt: z.string(),
// 	$updatedAt: z.string(),
// 	$permissions: z.array(z.string())
// });

export const submissionSchema = z.object({
	user_id: z.string(),
	stage: z.enum(['draft', 'completed'])
});

export const responseSchema = z.object({
	submission_id: z.string(),
	question_id: z.string(),
	choice_id: z.string()
});
