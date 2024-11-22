import { SESSION_COOKIE, createAdminClient, ID } from "$lib/server/appwrite";
import { fail, redirect } from "@sveltejs/kit";

export async function load({ locals }) {
}

export const actions = {
    signup: async ({ request, cookies }) => {
        const form = await request.formData();
        const email = form.get("email") as string;
        const password = form.get("password") as string;
        const name = form.get("name") as string;


        const { account } = createAdminClient();
        try {
            await account.create(ID.unique(), email, password, name);
            const session = await account.createEmailPasswordSession(email, password);

            cookies.set(SESSION_COOKIE, session.secret, {
                sameSite: "strict",
                expires: new Date(session.expire),
                secure: true,
                path: "/",
            });

        } catch (error: any) {
            return fail(400, {
                // Use the Appwrite error message if available
                error: error.message || 'Signup failed'
            });
        }
        redirect(302, "/account");
    },
};
