import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';

/**
 * Edits a question
 * @param id: The id of the question to edit
 * @param data: The new data for the question
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		error(401, 'Unauthorized');
	}
	const { id, data } = await request.json();

	try {
		// console.log('Editing question', id, data);
		const result = await locals.userdb!.updateDocument(
			'questionnaire', // databaseId
			'questions', // collectionId
			id, // documentId
			data // data (optional)
			// ["read("any")"] // permissions (optional)
		);

		return json(result);
	} catch (err) {
		console.error(err);
		error(500, err instanceof Error ? err.message : 'Internal server error');
	}
};
