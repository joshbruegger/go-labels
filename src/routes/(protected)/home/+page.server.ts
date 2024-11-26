import { SESSION_COOKIE, createSessionClient } from '$lib/server/appwrite';
import { redirect, type Actions } from '@sveltejs/kit';
import type { Category, Question, Choice, CategorizedQuestions } from '$lib/models/data-model';
import { Databases, type Models } from 'node-appwrite';
import { Query, ID } from 'node-appwrite';
import { questionnaireSchema, responseSchema } from './questionnaire-schema';
import type { PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async (event) => {
	const { locals } = event;
	const user = locals.user as Models.User<Models.Preferences>;
	let adminDB = locals.admindb as Databases;

	const questionnaire: CategorizedQuestions[] = await fetchQuestionnaire(adminDB);

	// Check for existing draft submission
	const draftSubmissions = await adminDB.listDocuments('questionnaire', 'submissions', [
		Query.equal('user_id', user.$id),
		Query.equal('status', 'draft')
	]);

	let submissionId = null;
	if (draftSubmissions.documents.length === 0) {
		const submission = await adminDB.createDocument('questionnaire', 'submissions', ID.unique(), {
			user_id: user.$id,
			status: 'draft'
		});
		submissionId = submission.$id;
	} else {
		submissionId = draftSubmissions.documents[0].$id;
	}

	return {
		categories: questionnaire,
		submissionId: submissionId,
		form: await superValidate(zod(questionnaireSchema))
	};
};

// Define our log out endpoint/server action.
export const actions: Actions = {
	saveResponse: async (event) => {
		const form = await superValidate(event, zod(responseSchema));
		if (!form.valid)
			return fail(400, {
				form
			});

		const databases = event.locals.userdb as Databases;

		try {
			// Check if a response for this question already exists
			const existingResponses = await databases.listDocuments('questionnaire', 'responses', [
				Query.equal('submission_id', form.data.submission_id),
				Query.equal('question_id', form.data.question_id)
			]);

			if (existingResponses.documents.length > 0) {
				// Update existing response
				const existingResponse = existingResponses.documents[0];
				await databases.updateDocument('questionnaire', 'responses', existingResponse.$id, {
					choice_id: form.data.choice_id
				});
			} else {
				// Create new response
				await databases.createDocument('questionnaire', 'responses', ID.unique(), {
					submission_id: form.data.submission_id,
					question_id: form.data.question_id,
					choice_id: form.data.choice_id
				});
			}
			return { success: true };
		} catch (error) {
			return fail(500, { message: 'Failed to save response' });
		}
	},
	complete: async (event) => {
		const form = await superValidate(event, zod(questionnaireSchema));
	},
	default: async (event) => {
		// Create the Appwrite client.
		const { account } = createSessionClient(event);

		// Delete the session on Appwrite, and delete the session cookie.
		await account.deleteSession('current');
		event.cookies.delete(SESSION_COOKIE, { path: '/' });

		// Redirect to the sign up page.
		redirect(302, '/login');
	}
};

async function fetchQuestionnaire(databases: Databases) {
	const categories = await databases.listDocuments('questionnaire', 'categories');

	// Process each category and its related data
	const categoriesWithQuestions: CategorizedQuestions[] = await Promise.all(
		categories.documents.map(async (category) => {
			const typedCategory = category as unknown as Category;
			// Fetch questions for this category
			const categoryQuestions = await databases.listDocuments('questionnaire', 'questions', [
				Query.equal('category_id', category.$id),
				Query.orderAsc('ordering')
			]);

			// Fetch and map choices for each question
			const questionsWithChoices = await Promise.all(
				categoryQuestions.documents.map(async (question) => {
					const typedQuestion = question as unknown as Question;
					const questionChoices = await databases.listDocuments('questionnaire', 'choices', [
						Query.equal('question_id', typedQuestion.$id)
					]);
					const choices: Choice[] = questionChoices.documents.map((choice) => ({
						...choice,
						text: (choice as unknown as Choice).text,
						isCorrect: (choice as unknown as Choice).isCorrect,
						question_id: question.$id
					}));
					return {
						...typedQuestion,
						choices,
						category_id: category.$id
					};
				})
			);

			return {
				...category,
				name: typedCategory.name,
				order: typedCategory.order,
				questions: questionsWithChoices
			};
		})
	);
	return categoriesWithQuestions;
}
