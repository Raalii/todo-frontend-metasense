import { Suspense } from "react";
import LoginForm from "./LoginForm";

/* ───────── Page server par défaut ───────── */
export default function LoginPage() {
  return (
    <>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </>
  );
}
