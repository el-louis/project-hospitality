"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, login, logout, register } from "@/lib/api";
import type { AuthFormState, AuthResponse } from "@/lib/types";

export function AuthCard() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState<AuthFormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [session, setSession] = useState<AuthResponse | null>(null);

  useEffect(() => {
    void getCurrentUser()
      .then(setSession)
      .catch(() => setSession(null));
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    try {
      const response =
        mode === "login"
          ? await login({ email: form.email, password: form.password })
          : await register(form);
      setSession(response);
      setStatus("success");
      setMessage(
        mode === "login"
          ? "Signed in successfully."
          : "Account created successfully.",
      );
      setForm((current) => ({ ...current, password: "" }));
    } catch {
      setStatus("error");
      setMessage("Authentication failed. Check your details and try again.");
    }
  };

  const handleLogout = async () => {
    setStatus("submitting");
    try {
      await logout();
      setSession(null);
      setStatus("idle");
      setMessage("Signed out successfully.");
    } catch {
      setStatus("error");
      setMessage("We could not sign you out. Please try again.");
    }
  };

  return (
    <div className="rounded-3xl border border-primary/10 bg-surface p-6 shadow-soft sm:p-8">
      {session ? (
        <div>
          <p className="font-semibold text-text-primary">
            Signed in as {session.user.fullName ?? session.user.email}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            {session.user.email}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            loading={status === "submitting"}
            className="mt-5 w-full"
          >
            Sign out
          </Button>
        </div>
      ) : (
        <>
          <div
            className="flex gap-2"
            role="tablist"
            aria-label="Authentication options"
          >
            {(["login", "register"] as const).map((option) => (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={mode === option}
                onClick={() => setMode(option)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === option ? "bg-primary text-white" : "text-text-secondary"}`}
              >
                {option === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "register" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <AuthInput
                  label="First name"
                  name="firstName"
                  value={form.firstName ?? ""}
                  onChange={handleChange}
                />
                <AuthInput
                  label="Last name"
                  name="lastName"
                  value={form.lastName ?? ""}
                  onChange={handleChange}
                />
              </div>
            ) : null}
            <AuthInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            <AuthInput
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              minLength={mode === "register" ? 12 : undefined}
            />
            <Button
              type="submit"
              loading={status === "submitting"}
              className="w-full"
            >
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </>
      )}
      {message ? (
        <p
          role={status === "error" ? "alert" : "status"}
          className={`mt-4 rounded-2xl px-4 py-3 text-sm ${status === "error" ? "bg-error/10 text-error" : "bg-success/10 text-success"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

function AuthInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block text-sm font-medium text-text-primary">
      {label}
      <input
        required
        className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm"
        {...props}
      />
    </label>
  );
}
