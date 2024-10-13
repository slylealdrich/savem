import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { signInSchema } from "$lib/schemas";
import { redirect, type Actions } from "@sveltejs/kit";
import { Argon2id } from "oslo/password";
import prisma from "$lib/prisma";
import { auth } from "$lib/auth";

export const load: PageServerLoad = async () => {
  const signInForm = await superValidate(zod(signInSchema));

  return { signInForm: signInForm };
};

export const actions: Actions = {
  signIn: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(signInSchema));

    if (!form.valid) return fail(400, { form });
    const { username, password } = form.data;

    const user = await prisma.user.findUnique({
      where: {
        username: username.toLowerCase(),
      },
    });

    const argon2id = new Argon2id();

    if (!user) return setError(form, "username", "Incorrect username or password");

    const validPassword = await argon2id.verify(user.hashedPassword, password);
    if (!validPassword) return setError(form, "username", "Incorrect username or password");

    const token = auth.generateSessionToken();
    const session = await auth.createSession(token, user.id);
    auth.setSessionTokenCookie(cookies, token, session.expiresAt);

    redirect(307, "/");
  },
};
