import { authOptions } from "@/src/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

// Ré-export des méthodes HTTP attendues par l’App Router
export { handler as GET, handler as POST };
