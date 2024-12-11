import type { Models } from 'node-appwrite';
import { Databases, ID, Query } from 'node-appwrite';

import type { PageServerLoad } from './$types.js';
import type { Category } from '$lib/models/data-model';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user as Models.User<Models.Preferences>;
	const adminDB = locals.admindb as Databases;

	return {
		categories: fetchQuestionnaire(adminDB),
		submissionId: fetchOrCreateDraft(adminDB, user)
	};
};

async function fetchQuestionnaire(adminDB: Databases) {
	// Fetch categories first
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

	// Use Promise.all to wait for all questions to be fetched
	const categoriesWithQuestions = await Promise.all(
		categories.map(async (category) => {
			const questions = await adminDB
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

			// Use Promise.all to wait for all choices to be fetched
			const questionsWithChoices = await Promise.all(
				questions.map(async (question) => {
					const choices = await adminDB
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

					return { ...question, choices };
				})
			);

			return { ...category, questions: questionsWithChoices };
		})
	);

	return categoriesWithQuestions as Category[];
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
