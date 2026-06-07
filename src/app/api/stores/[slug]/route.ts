import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      categories: {
        include: { products: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!store) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  return NextResponse.json(store);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "SELLER") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { slug } = await params;
  const body = await req.json();
  const store = await prisma.store.update({ where: { slug }, data: body });
  return NextResponse.json(store);
}
