import "next-auth";

declare module "next-auth" {
  /** Ajout du JWT sur l’objet Session côté client/serveur */
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
  }

  /** Ajout du JWT côté callback `jwt()` */
  interface User {
    accessToken?: string;
    id: string;
    email: string;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

interface ServerError {
  message: string;
}
