import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import WizardClient from "./WizardClient";

export default async function CreatePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "SELLER") redirect("/");
  return <WizardClient />;
}
