import { fail, redirect } from '@sveltejs/kit';

import { createAdminClient, ID, SESSION_COOKIE } from '$lib/server/appwrite';

export async function load({ locals }) {}

export const actions = {
	login: async ({ request, cookies }) => {
		const form = await request.formData();
		const email = form.get('email') as string;
		const password = form.get('password') as string;

		const { account } = createAdminClient();
		try {
			const session = await account.createEmailPasswordSession(email, password);

			cookies.set(SESSION_COOKIE, session.secret, {
				sameSite: 'strict',
				expires: new Date(session.expire),
				secure: true,
				path: '/'
			});
		} catch (error: any) {
			return fail(400, {
				// Use the Appwrite error message if available
				error: error.message || 'Login failed'
			});
		}
		redirect(302, '/home');
	}
};
