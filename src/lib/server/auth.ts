import { redirect } from '@sveltejs/kit';

export function requireAuth(locals: App.Locals) {
    if (!locals.user) {
        redirect(302, '/login');
    }
    return locals.user;
}