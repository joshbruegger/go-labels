import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
    // Redirect already logged in users to home
    if (locals.user) {
        redirect(302, "/home");
    }

    return {
        user: locals.user
    };
}