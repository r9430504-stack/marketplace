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

  const { name, description, details, price, oldPrice, currency, images, categoryId, inStock } = await req.json();

  const product = await prisma.product.create({
    data: {
      name,
      description,
      details: details ?? null,
      price,
      oldPrice: oldPrice ?? null,
      currency: currency ?? "RUB",
      images: images ?? [],
      categoryId,
      storeId: store.id,
      inStock: inStock ?? true,
    },
  });

  return NextResponse.json(product);
}
