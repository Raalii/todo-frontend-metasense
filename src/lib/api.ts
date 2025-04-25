import axios, { AxiosRequestHeaders } from "axios";
import { getSession } from "next-auth/react";

/** Instance Axios réutilisable partout  */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = session?.accessToken; // ✔️ bon champ

  if (token) {
    /* config.headers peut être undefined ou AxiosHeaders – on cast. */
    (config.headers ??=
      {} as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
  }
  return config;
});
