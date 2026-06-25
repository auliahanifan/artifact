"use client";

import { useActionState } from "react";

import { createArtifactAction, logoutAction } from "./actions";
import styles from "./input.module.css";

type CreateState = {
  error?: string;
  uniquecode?: string;
  url?: string;
} | null;

const sampleHtml = "<html><body><h1>Hello</h1></body></html>";

export function ArtifactForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: CreateState, formData: FormData) => {
      return createArtifactAction(formData);
    },
    null,
  );

  return (
    <div className={styles.form}>
      <div className={styles.actions} style={{ justifyContent: "space-between" }}>
        <h1 className={styles.title}>Create artifact</h1>
        <form action={logoutAction}>
          <button className={styles.buttonSecondary} type="submit">
            Log out
          </button>
        </form>
      </div>

      <p className={styles.description}>
        Submit HTML to host at <code>/{"{uniquecode}"}</code>.
      </p>

      {state?.error ? <p className={styles.error}>{state.error}</p> : null}

      {state?.url ? (
        <p className={styles.success}>
          Created{" "}
          <a href={state.url} target="_blank" rel="noreferrer">
            {state.url}
          </a>
        </p>
      ) : null}

      <form action={formAction}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="uniquecode">
            Unique code
          </label>
          <input
            className={styles.input}
            id="uniquecode"
            name="uniquecode"
            type="text"
            placeholder="Optional — auto-generated if empty"
            defaultValue={state?.uniquecode ?? ""}
          />
          <p className={styles.hint}>
            3–64 characters: letters, numbers, underscores, hyphens.
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="html">
            HTML
          </label>
          <textarea
            className={styles.textarea}
            id="html"
            name="html"
            defaultValue={sampleHtml}
          />
          <p className={styles.hint}>
            Paste HTML here, or upload a file below.
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="html_file">
            HTML file
          </label>
          <input
            className={styles.input}
            id="html_file"
            name="html_file"
            type="file"
            accept=".html,.htm,text/html"
          />
          <p className={styles.hint}>
            Optional. If provided, the file overrides the textarea.
          </p>
        </div>

        <div className={styles.actions}>
          <button className={styles.button} type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create artifact"}
          </button>
        </div>
      </form>
    </div>
  );
}
