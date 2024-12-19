import { json } from '@sveltejs/kit';
import { Databases, ID } from 'node-appwrite';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const adminDB = locals.admindb as Databases;
	const { question_id, text, points } = await request.json();

	try {
		const choice = await adminDB.createDocument('questionnaire', 'choices', ID.unique(), {
			question_id,
			text,
			points,
			requires_manual_points: false
		});

		return json(choice);
	} catch (error) {
		console.error(error);
		return json(
			{ error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
};
