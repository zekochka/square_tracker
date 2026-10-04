import { NextResponse } from "next/server";
import { removeSquare, updateSquare } from "@/server/squares-file-store";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("comment" in body) ||
    typeof body.comment !== "string" || body.comment.length > 500) {
    return NextResponse.json({ error: "Некорректный комментарий." }, { status: 400 });
  }
  const { id } = await params;
  try {
    const updated = await updateSquare(id, body.comment);
    return updated ? NextResponse.json(updated) :
      NextResponse.json({ error: "Квадрат не найден." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Не удалось обновить файл с квадратами." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    return await removeSquare(id) ? new Response(null, { status: 204 }) :
      NextResponse.json({ error: "Квадрат не найден." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Не удалось обновить файл с квадратами." }, { status: 500 });
  }
}
