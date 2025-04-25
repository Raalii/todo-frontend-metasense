import type { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

/**
 * Options NextAuth partagées côté route d'API et côté serveur
 */
export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );

        if (!res.ok) return null;

        const { token, user } = (await res.json()) as {
          token: string;
          user: User;
        };

        // On renvoie un objet User enrichi : NextAuth l'ajoute dans `user` des callbacks
        return { ...user, accessToken: token };
      },
    }),
  ],

  callbacks: {
    /**
     * Injecte l'`accessToken` dans le JWT stocké par NextAuth
     */
    jwt({ token, user }): JWT | Promise<JWT> {
      if (user)
        token.accessToken = (
          user as User & { accessToken: string }
        ).accessToken;
      return token;
    },

    /**
     * Répercute l'`accessToken` sur la session envoyée au client
     */
    session({ session, token }): Session | Promise<Session> {
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
