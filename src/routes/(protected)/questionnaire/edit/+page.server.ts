import type { CategorizedQuestions } from '$lib/models/data-model';
import { SESSION_COOKIE, createSessionClient } from '$lib/server/appwrite';
import { fetchQuestionnaire } from '$lib/server/services/questionnaire';
import { redirect, type Actions } from '@sveltejs/kit';
import { Databases, ID, Query, type Models } from 'node-appwrite';

import type { PageServerLoad } from './$types.js';

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
		submissionId: submissionId
	};
};

// Define our log out endpoint/server action.
export const actions: Actions = {};
