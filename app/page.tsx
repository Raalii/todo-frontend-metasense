"use client";
import { api } from "@/lib/api";
import useSWR from "swr";

export default function Hello() {
  const { data } = useSWR("/api/hello", (url) =>
    api.get(url).then((r) => r.data)
  );
  return (
    <div>
      <h1>Hello</h1>
      <pre className="p-4">{data ? data.message : "Loading…"}</pre>;
    </div>
  );
}
