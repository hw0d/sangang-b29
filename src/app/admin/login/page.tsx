import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div style={{ maxWidth: 320, margin: "24px auto" }}>
      <fieldset>
        <legend>Restricted Access</legend>
        <h1 className="mb-3">Admin Sign In</h1>
        <LoginForm />
      </fieldset>
    </div>
  );
}
