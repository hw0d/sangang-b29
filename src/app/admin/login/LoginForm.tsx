"use client";

import { useActionState } from "react";
import { authenticate } from "./actions";

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="block text-xs uppercase tracking-wide text-muted mb-1 font-record">
          Username
        </span>
        <input
          name="username"
          type="text"
          required
          autoFocus
          className="field-input"
        />
      </label>
      <label className="block">
        <span className="block text-xs uppercase tracking-wide text-muted mb-1 font-record">
          Password
        </span>
        <input
          name="password"
          type="password"
          required
          className="field-input"
        />
      </label>
      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}
      <button type="submit" disabled={isPending} className="btn-primary w-full justify-center">
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
