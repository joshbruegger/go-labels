import { createSessionClient } from '$lib/server/appwrite';

export async function handle({ event, resolve }) {
    try {
        const { account } = createSessionClient(event);
        // Store the current logged in user in locals,
        // for easy access in our other routes.
        event.locals.user = await account.get();
    } catch (error) {
        console.error("Error creating session client:", error);
    }

    // Continue with the request.
    return resolve(event);
}
