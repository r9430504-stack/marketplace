import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "SELLER") {
    return NextResponse.json(null);
  }

  const store = await prisma.store.findUnique({
    where: { ownerId: session.userId },
    include: {
      categories: {
        include: { products: true },
        orderBy: { order: "asc" },
      },
    },
  });

  return NextResponse.json(store);
}
