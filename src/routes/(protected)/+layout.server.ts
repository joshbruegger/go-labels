import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
    // Redirect not logged in users to login page
    if (!locals.user) {
        redirect(302, '/login');
    }

    return {
        user: locals.user
    };
}