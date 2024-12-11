import type { Models } from 'node-appwrite';
import { redirect } from '@sveltejs/kit';

import { createSessionClient, SESSION_COOKIE } from '$lib/server/appwrite';

export async function load({ locals }) {
	return {
		user: locals.user as Models.User<Models.Preferences>
	};
}

// Define our log out endpoint/server action.
export const actions = {
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
