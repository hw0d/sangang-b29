"use client";

import { useActionState } from "react";
import { authenticate } from "./actions";

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <form action={formAction} className="field-row-stacked">
      <div>
        <label htmlFor="username" className="block text-xs mb-1">
          Username
        </label>
        <input id="username" name="username" type="text" required autoFocus />
      </div>
      <div>
        <label htmlFor="password" className="block text-xs mb-1">
          Password
        </label>
        <input id="password" name="password" type="password" required />
      </div>
      {errorMessage && <p className="text-sm">⚠ {errorMessage}</p>}
      <button type="submit" className="default" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
