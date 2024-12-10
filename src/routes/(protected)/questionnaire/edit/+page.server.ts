import type { CategorizedQuestions, Category, Choice, Question } from '$lib/models/data-model';
import { SESSION_COOKIE, createSessionClient } from '$lib/server/appwrite';
// import { fetchQuestionnaire } from '$lib/server/services/questionnaire';
import { redirect, type Actions } from '@sveltejs/kit';
import { Databases, ID, Query, type Models } from 'node-appwrite';

import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user as Models.User<Models.Preferences>;
	const adminDB = locals.admindb as Databases;

	return {
		categories: fetchQuestionnaire(adminDB),
		submissionId: fetchOrCreateDraft(adminDB, user)
	};
};

// Define our log out endpoint/server action.
export const actions: Actions = {};

async function fetchQuestionnaire(adminDB: Databases) {
	const categories: Category[] = await adminDB
		.listDocuments('questionnaire', 'categories', [Query.orderAsc('ordering')])
		.then((result) =>
			result.documents.map((doc) => ({
				...doc,
				name: doc.name,
				ordering: doc.ordering,
				questions: []
			}))
		);

	categories.forEach(async (category) => {
		// fetch questions for each category
		const questions: Question[] = await adminDB
			.listDocuments('questionnaire', 'questions', [
				Query.equal('category_id', category.$id),
				Query.orderAsc('ordering')
			])
			.then((result) =>
				result.documents.map((doc) => ({
					...doc,
					category_id: doc.category_id,
					text: doc.text,
					ordering: doc.ordering,
					type: doc.type,
					requires_evidence: doc.requires_evidence,
					description: doc.description,
					explanation: doc.explanation,
					choices: []
				}))
			);

		questions.forEach(async (question) => {
			// fetch choices for each question
			const choices: Choice[] = await adminDB
				.listDocuments('questionnaire', 'choices', [
					Query.equal('question_id', question.$id),
					Query.orderDesc('points')
				])
				.then((result) =>
					result.documents.map((doc) => ({
						...doc,
						question_id: doc.question_id,
						text: doc.text,
						points: doc.points
					}))
				);

			// assign choices to question
			question.choices = choices as any;
		});

		// assign questions to category
		category.questions = questions as any;
	});

	return categories;
}

async function fetchOrCreateDraft(adminDB: Databases, user: Models.User<Models.Preferences>) {
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
	} else submissionId = draftSubmissions.documents[0].$id;

	return submissionId;
}
