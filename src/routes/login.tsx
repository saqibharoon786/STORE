import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ShoppingBag } from "lucide-react";
import { ADMIN_EMAIL, login, useAdminSession, useClientReady } from "@/lib/site-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Admin login | Luxora" },
      { name: "description", content: "Sign in to manage Luxora categories, products, and homepage content." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const ready = useClientReady();
  const session = useAdminSession();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && session) navigate({ to: "/admin" });
  }, [ready, session, navigate]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const ok = login(email, password);
    if (!ok) {
      setError("Email or password is incorrect.");
      return;
    }
    navigate({ to: "/admin" });
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={onSubmit}>
        <Link to="/" className="login-brand" aria-label="Luxora home">
          <ShoppingBag size={28} aria-hidden="true" />
          <span>Luxora</span>
        </Link>
        <p className="collections-kicker">ADMIN</p>
        <h1>Sign in</h1>
        <p className="login-lead">Manage categories, products, and the homepage. Changes stay in this browser.</p>
        <label>
          Email
          <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {error && <p className="login-error">{error}</p>}
        <button type="submit">Sign in</button>
        <p className="login-hint">
          Demo login: <strong>{ADMIN_EMAIL}</strong> / <strong>123</strong>
        </p>
      </form>
    </main>
  );
}
