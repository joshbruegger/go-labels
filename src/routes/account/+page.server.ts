// src/routes/account/+page.server.js

import { SESSION_COOKIE, createSessionClient } from "$lib/server/appwrite";
import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
    if (!locals.user) {
        console.log("User not logged in, redirecting to login.");
        redirect(302, "/login");
    }

    console.log("Loading account for user:", locals.user);
    return {
        user: locals.user,
    };
}

// Define our log out endpoint/server action.
export const actions = {
    default: async (event) => {
        // Create the Appwrite client.
        const { account } = createSessionClient(event);

        // Delete the session on Appwrite, and delete the session cookie.
        await account.deleteSession("current");
        event.cookies.delete(SESSION_COOKIE, { path: "/" });

        // Redirect to the sign up page.
        redirect(302, "/login");
    },
};
