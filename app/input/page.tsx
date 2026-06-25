import { isAuthenticated } from "@/lib/auth";

import { ArtifactForm } from "./artifact-form";
import { LoginForm } from "./login-form";

export default async function InputPage() {
  const authed = await isAuthenticated();

  return <main>{authed ? <ArtifactForm /> : <LoginForm />}</main>;
}
