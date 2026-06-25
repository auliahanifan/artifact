import { NextRequest, NextResponse } from "next/server";

import {
  ArtifactError,
  createArtifact,
  parseArtifactFormData,
} from "@/lib/artifacts";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 415 },
      );
    }

    const formData = await request.formData();
    const { uniquecode, html } = await parseArtifactFormData(formData);

    const result = await createArtifact({ uniquecode, html });

    const origin =
      request.headers.get("x-forwarded-host") ??
      request.headers.get("host") ??
      "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") ?? "http";
    const url = `${protocol}://${origin}/${result.uniquecode}`;

    return NextResponse.json(
      { uniquecode: result.uniquecode, url },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ArtifactError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Failed to create artifact:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
