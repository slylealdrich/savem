import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { auth } from "$lib/auth";

export const handle: Handle = async ({ event, resolve }) => {
  // skip authentication for these routes
  const inAuth =
    event.url.pathname.startsWith("/sign-in") || event.url.pathname.startsWith("/sign-up");

  // check to see if there is a session cookie
  const token = event.cookies.get("session") ?? null;
  if (token === null) {
    event.locals.user = null;
    event.locals.session = null;
    if (inAuth) return resolve(event);
    else throw redirect(307, "/sign-in");
  }

  const { session, user } = await auth.validateSessionToken(token);

  if (session === null) {
    // remove the session cookie if invalid
    auth.deleteSessionTokenCookie(event.cookies);
  } else {
    // reset the session cookie if valid
    auth.setSessionTokenCookie(event.cookies, token, session.expiresAt);
  }

  event.locals.user = user;
  event.locals.session = session;


  return resolve(event);
};
