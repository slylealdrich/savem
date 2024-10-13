import prisma from "$lib/prisma.js";

import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { Session, User } from "@prisma/client";
import type { Cookies } from "@sveltejs/kit";

class Auth {
  public generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
  }

  public async createSession(token: string, userId: string): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = {
      id: sessionId,
      userId: userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    };
    await prisma.session.create({
      data: session,
    });
    return session;
  }

  public async validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const result = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: true,
      },
    });
    if (result === null) {
      return { session: null, user: null };
    }
    const { user, ...session } = result;
    if (Date.now() >= session.expiresAt.getTime()) {
      await prisma.session.delete({ where: { id: sessionId } });
      return { session: null, user: null };
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 25 * 30);
      await prisma.session.update({
        where: {
          id: session.id,
        },
        data: {
          expiresAt: session.expiresAt,
        },
      });
    }
    return { session: session, user: user };
  }

  public async invalidateSession(sessionId: string) {
    await prisma.session.delete({ where: { id: sessionId } });
  }

  public setSessionTokenCookie(cookies: Cookies, token: string, expires: Date) {
    cookies.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      expires: expires,
      path: "/",
    });
  }

  public deleteSessionTokenCookie(cookies: Cookies) {
    cookies.set("session", "", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
  }
}

export const auth = new Auth();

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
