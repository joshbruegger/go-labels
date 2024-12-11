import type { Actions } from '@sveltejs/kit';
import type { Models } from 'node-appwrite';
import { redirect } from '@sveltejs/kit';
import { Databases, ID, Query } from 'node-appwrite';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import type { PageServerLoad } from './$types.js';
import type { CategorizedQuestions } from '$lib/models/data-model';
import { createSessionClient, SESSION_COOKIE } from '$lib/server/appwrite';
import { fetchQuestionnaire } from '$lib/server/services/questionnaire';
import { responseSchema } from './schema';

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
		form: await superValidate(zod(responseSchema))
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
		const form = await superValidate(event, zod(responseSchema));
	},
	logout: async (event) => {
		// Create the Appwrite client.
		const { account } = createSessionClient(event);

		// Delete the session on Appwrite, and delete the session cookie.
		await account.deleteSession('current');
		event.cookies.delete(SESSION_COOKIE, { path: '/' });

		// Redirect to the sign up page.
		redirect(302, '/login');
	}
};
