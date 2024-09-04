import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { signUpSchema } from "$lib/schemas";
import { redirect, type Actions } from "@sveltejs/kit";
import { Argon2id } from "oslo/password";
import prisma from "$lib/prisma";
import { lucia } from "$lib/auth";

export const load: PageServerLoad = async () => {
  const signUpForm = await superValidate(zod(signUpSchema));

  return { signUpForm: signUpForm };
};

export const actions: Actions = {
  signUp: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(signUpSchema));

    if (!form.valid) return fail(400, { form });

    const { username, password } = form.data;

    const argon2id = new Argon2id();
    const hashedPassword = await argon2id.hash(password);

    const existingUser = await prisma.user.findUnique({
      where: {
        username: username.toLowerCase(),
      },
    });

    if (existingUser) return setError(form, "username", "Username taken");

    const user = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        hashedPassword: hashedPassword,
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });

    redirect(307, "/");
  },
};
