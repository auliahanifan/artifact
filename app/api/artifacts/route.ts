import { NextRequest, NextResponse } from "next/server";

import { ArtifactError, createArtifact } from "@/lib/artifacts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uniquecode, html } = body as {
      uniquecode?: string;
      html?: string;
    };

    const result = await createArtifact({ uniquecode, html: html ?? "" });

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
