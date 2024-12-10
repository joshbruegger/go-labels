import { createAdminClient, createSessionClient } from '$lib/server/appwrite';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	try {
		const { account, databases } = createSessionClient(event);
		// Store the current logged in user in locals,
		// for easy access in our other routes.
		event.locals.user = await account.get();
		event.locals.userdb = databases;
		event.locals.admindb = await createAdminClient().databases;
	} catch (error) {
		// console.error("Error creating session client:", error);
	}

	// Protect routes that require authentication.
	if (event.route.id?.startsWith('/(protected)') && !event.locals.user) {
		redirect(302, '/login');
	}

	// Redirect already logged in users to home when they try to access the login or sign up page.
	if (event.route.id?.startsWith('/(auth)') && event.locals.user) {
		redirect(302, '/home');
	}

	// Continue with the request.
	return resolve(event);
}
