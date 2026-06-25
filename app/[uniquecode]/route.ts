import { getArtifactByCode } from "@/lib/artifacts";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uniquecode: string }> },
) {
  const { uniquecode } = await params;
  const artifact = await getArtifactByCode(uniquecode);

  if (!artifact) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(artifact.html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
