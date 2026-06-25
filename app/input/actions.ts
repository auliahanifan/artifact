"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  ArtifactError,
  createArtifact,
  parseArtifactFormData,
} from "@/lib/artifacts";
import {
  clearAuthCookie,
  isAuthenticated,
  setAuthCookie,
  verifyCredentials,
} from "@/lib/auth";

async function getPublicOrigin() {
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ??
    headerStore.get("host") ??
    "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!verifyCredentials(username, password)) {
    return { error: "Invalid username or password" };
  }

  await setAuthCookie();
  redirect("/input");
}

export async function logoutAction() {
  await clearAuthCookie();
  redirect("/input");
}

export async function createArtifactAction(formData: FormData) {
  if (!(await isAuthenticated())) {
    return { error: "Unauthorized" };
  }

  const { uniquecode, html } = await parseArtifactFormData(formData);

  try {
    const result = await createArtifact({
      uniquecode,
      html,
    });

    const origin = await getPublicOrigin();
    const url = `${origin}/${result.uniquecode}`;

    return { uniquecode: result.uniquecode, url };
  } catch (error) {
    if (error instanceof ArtifactError) {
      return { error: error.message };
    }

    console.error("Failed to create artifact:", error);
    return { error: "Internal server error" };
  }
}
