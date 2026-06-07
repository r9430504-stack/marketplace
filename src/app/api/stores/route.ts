import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const stores = await prisma.store.findMany({
    where: { status: "PUBLISHED" },
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(stores);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SELLER") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const body = await req.json();
  const slug = body.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    + "-" + Date.now();

  const store = await prisma.store.upsert({
    where: { ownerId: session.userId },
    update: body,
    create: { ...body, slug, ownerId: session.userId },
  });

  return NextResponse.json(store);
}
