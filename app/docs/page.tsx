"use client";

import dynamic from "next/dynamic";

import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function DocsPage() {
  return (
    <main>
      <SwaggerUI url="/api/openapi" />
    </main>
  );
}
