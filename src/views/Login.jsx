import { useState } from "react";
import { Galaxy, Lock } from "lucide-react";

function Login({ onSignIn, error, loading }) {
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSignIn(password);
    setPassword("");
  }

  return (
    <div
      className="tixniverse-app min-h-screen w-full flex items-center justify-center px-4"
      style={{ background: "var(--ink)" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs rounded-2xl p-6"
        style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Galaxy size={24} style={{ color: "var(--green)" }} />
          <h1 className="font-pixel sm:text-xl text-xl">
            Ti<span style={{ color: "var(--green)" }}>x</span>niverse
          </h1>
        </div>
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
          Sign in to your collection.
        </p>

        <label className="flex flex-col gap-1.5 text-sm">
          <span
            className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: "var(--muted)" }}
          >
            <Lock size={12} /> Password
          </span>
          <input
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="stub-input"
            placeholder="******"
          />
        </label>

        {error && (
          <p className="text-xs mt-2" style={{ color: "var(--red)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full mt-4 rounded-lg py-2.5 font-semibold text-sm text-white cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: "var(--purple)",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default Login;
