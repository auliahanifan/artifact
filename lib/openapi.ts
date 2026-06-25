export function getOpenApiSpec(serverUrl: string) {
  return {
    openapi: "3.0.3",
    info: {
      title: "Artifact API",
      description:
        "Host HTML pages at `/{uniquecode}` with a simple public API.",
      version: "0.1.0",
    },
    servers: [{ url: serverUrl }],
    paths: {
      "/api/artifacts": {
        post: {
          summary: "Create a new artifact",
          description:
            "Stores HTML content and returns a unique code and public URL. If `uniquecode` is omitted, a 10-character code is generated automatically.",
          operationId: "createArtifact",
          tags: ["Artifacts"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateArtifactRequest" },
                examples: {
                  autoCode: {
                    summary: "Auto-generated code",
                    value: {
                      html: "<html><body><h1>Hello</h1></body></html>",
                    },
                  },
                  customCode: {
                    summary: "Custom code",
                    value: {
                      uniquecode: "demo",
                      html: "<html><body>Demo</body></html>",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Artifact created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CreateArtifactResponse" },
                },
              },
            },
            "400": {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                  examples: {
                    missingHtml: {
                      value: { error: "html is required" },
                    },
                    invalidUniquecode: {
                      value: {
                        error:
                          "uniquecode must be 3-64 characters and contain only letters, numbers, underscores, or hyphens",
                      },
                    },
                  },
                },
              },
            },
            "409": {
              description: "Unique code already exists",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                  example: { error: "uniquecode already exists" },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                  example: { error: "Internal server error" },
                },
              },
            },
          },
        },
      },
      "/{uniquecode}": {
        get: {
          summary: "Serve stored HTML",
          description: "Returns the HTML content for the given unique code.",
          operationId: "getArtifact",
          tags: ["Artifacts"],
          parameters: [
            {
              name: "uniquecode",
              in: "path",
              required: true,
              description:
                "Artifact identifier (3–64 characters: letters, numbers, underscores, hyphens). Auto-generated codes are 10 characters.",
              schema: {
                type: "string",
                pattern: "^[a-zA-Z0-9_-]{3,64}$",
                example: "demo",
              },
            },
          ],
          responses: {
            "200": {
              description: "HTML content",
              content: {
                "text/html": {
                  schema: { type: "string" },
                  example: "<html><body><h1>Hello</h1></body></html>",
                },
              },
            },
            "404": {
              description: "Artifact not found",
              content: {
                "text/plain": {
                  schema: { type: "string" },
                  example: "Not found",
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        CreateArtifactRequest: {
          type: "object",
          required: ["html"],
          properties: {
            html: {
              type: "string",
              description: "HTML content to host. Must not be empty.",
              example: "<html><body><h1>Hello</h1></body></html>",
            },
            uniquecode: {
              type: "string",
              minLength: 3,
              maxLength: 64,
              pattern: "^[a-zA-Z0-9_-]+$",
              description:
                "Optional custom identifier. If omitted, a 10-character code is generated.",
              example: "demo",
            },
          },
        },
        CreateArtifactResponse: {
          type: "object",
          required: ["uniquecode", "url"],
          properties: {
            uniquecode: {
              type: "string",
              example: "demo",
            },
            url: {
              type: "string",
              format: "uri",
              example: "http://localhost:3000/demo",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          required: ["error"],
          properties: {
            error: {
              type: "string",
              example: "html is required",
            },
          },
        },
      },
    },
  } as const;
}
