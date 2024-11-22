export async function load({ locals }) {
    // Simply return the user state, let individual pages handle auth requirements
    return {
        user: locals.user
    };
}