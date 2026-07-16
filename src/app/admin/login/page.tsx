import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="max-w-sm mx-auto mt-12">
      <div className="text-center mb-6">
        <p className="font-record text-xs uppercase tracking-widest text-accent mb-1">
          Restricted Access
        </p>
        <h1 className="text-xl font-semibold">Admin Sign In</h1>
      </div>
      <div className="rounded-lg border border-border bg-surface p-6">
        <LoginForm />
      </div>
    </div>
  );
}
