import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import {
  getCachedArtifact,
  setCachedArtifact,
} from "./artifact-cache";
import { getDb } from "./db";
import { artifacts } from "./db/schema";

const UNIQUECODE_PATTERN = /^[a-zA-Z0-9_-]{3,64}$/;

export class ArtifactError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ArtifactError";
  }
}

export async function parseArtifactFormData(formData: FormData) {
  const uniquecodeRaw = String(formData.get("uniquecode") ?? "").trim();
  const uniquecode = uniquecodeRaw || undefined;

  const htmlFile = formData.get("html_file");
  if (htmlFile instanceof File && htmlFile.size > 0) {
    return { uniquecode, html: await htmlFile.text() };
  }

  return { uniquecode, html: String(formData.get("html") ?? "") };
}

export function validateUniquecode(code: string) {
  if (!UNIQUECODE_PATTERN.test(code)) {
    throw new ArtifactError(
      "uniquecode must be 3-64 characters and contain only letters, numbers, underscores, or hyphens",
      400,
    );
  }
}

export async function createArtifact(input: {
  uniquecode?: string;
  html: string;
}) {
  if (!input.html || input.html.trim().length === 0) {
    throw new ArtifactError("html is required", 400);
  }

  const uniquecode = input.uniquecode?.trim() || nanoid(10);

  if (input.uniquecode) {
    validateUniquecode(uniquecode);
  }

  const db = getDb();

  const existing = await db
    .select({ id: artifacts.id })
    .from(artifacts)
    .where(eq(artifacts.uniquecode, uniquecode))
    .limit(1);

  if (existing.length > 0) {
    throw new ArtifactError("uniquecode already exists", 409);
  }

  await db.insert(artifacts).values({
    uniquecode,
    html: input.html,
  });

  setCachedArtifact(uniquecode, input.html);

  return { uniquecode };
}

export async function getArtifactByCode(uniquecode: string) {
  const cached = getCachedArtifact(uniquecode);
  if (cached) {
    return cached;
  }

  const db = getDb();

  const rows = await db
    .select({ html: artifacts.html })
    .from(artifacts)
    .where(eq(artifacts.uniquecode, uniquecode))
    .limit(1);

  const artifact = rows[0] ?? null;
  if (artifact) {
    setCachedArtifact(uniquecode, artifact.html);
  }

  return artifact;
}
