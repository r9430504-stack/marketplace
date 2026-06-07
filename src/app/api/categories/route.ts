import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SELLER") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const store = await prisma.store.findUnique({ where: { ownerId: session.userId } });
  if (!store) return NextResponse.json({ error: "Магазин не найден" }, { status: 404 });

  const { name, order } = await req.json();
  const category = await prisma.category.create({
    data: { name, order: order ?? 0, storeId: store.id },
  });

  return NextResponse.json(category);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SELLER") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const store = await prisma.store.findUnique({ where: { ownerId: session.userId } });
  if (!store) return NextResponse.json({ error: "Магазин не найден" }, { status: 404 });

  const categories: { id?: string; name: string; order: number }[] = await req.json();

  await prisma.category.deleteMany({ where: { storeId: store.id } });

  const created = await Promise.all(
    categories.map((c, i) =>
      prisma.category.create({ data: { name: c.name, order: i, storeId: store.id } })
    )
  );

  return NextResponse.json(created);
}
