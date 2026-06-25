"use client";

import { useActionState } from "react";

import { loginAction } from "./actions";
import styles from "./input.module.css";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return loginAction(formData);
    },
    null,
  );

  return (
    <form className={styles.form} action={formAction}>
      <h1 className={styles.title}>Login</h1>
      <p className={styles.description}>Sign in to create artifacts.</p>

      {state?.error ? <p className={styles.error}>{state.error}</p> : null}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="username">
          Username
        </label>
        <input
          className={styles.input}
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          className={styles.input}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.button} type="submit" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </form>
  );
}
