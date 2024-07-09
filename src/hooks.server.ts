import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { lucia } from "$lib/auth";

export const handle: Handle = async ({ event, resolve }) => {
  // skip authentication for these routes
  if (event.url.pathname.startsWith("/sign-in") || event.url.pathname.startsWith("/sign-up")) {
    return resolve(event);
  }

  // check to see if there is a session cookie
  const sessionId = event.cookies.get(lucia.sessionCookieName);
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    throw redirect(307, "/sign-in");
  }

  const { session, user } = await lucia.validateSession(sessionId);

  // remake the session
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
  }

  // create a new session cookie
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
  }

  event.locals.user = user;
  event.locals.session = session;

  return resolve(event);
};
