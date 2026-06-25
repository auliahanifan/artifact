import { NextRequest, NextResponse } from "next/server";

import { getOpenApiSpec } from "@/lib/openapi";

function getServerUrl(request: NextRequest) {
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "localhost:3000";
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

export async function GET(request: NextRequest) {
  const spec = getOpenApiSpec(getServerUrl(request));

  return NextResponse.json(spec);
}
