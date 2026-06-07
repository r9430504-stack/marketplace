import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "SELLER") redirect("/login");

  const store = await prisma.store.findUnique({
    where: { ownerId: session.userId },
    include: {
      categories: {
        include: { products: true },
        orderBy: { order: "asc" },
      },
      _count: { select: { products: true } },
    },
  });

  if (!store) redirect("/create");

  return <DashboardClient store={store as never} session={session} />;
}
