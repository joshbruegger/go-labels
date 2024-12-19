import { json } from '@sveltejs/kit';
import { Databases } from 'node-appwrite';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const adminDB = locals.admindb as Databases;
	const { id } = await request.json();

	try {
		await adminDB.deleteDocument('questionnaire', 'choices', id);
		return json({ success: true });
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
};
