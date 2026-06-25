export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: "40rem" }}>
      <h1>Artifact</h1>
      <p>Host HTML at <code>/{`{uniquecode}`}</code></p>
      <h2>API</h2>
      <pre style={{ background: "#f4f4f4", padding: "1rem", overflow: "auto" }}>
{`POST /api/artifacts
{
  "uniquecode": "optional",
  "html": "<html>...</html>"
}`}
      </pre>
    </main>
  );
}
