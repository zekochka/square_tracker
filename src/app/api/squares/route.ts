import { NextResponse } from "next/server";
import { addSquare, listSquares } from "@/server/squares-file-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await listSquares(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Не удалось прочитать файл с квадратами." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("comment" in body) || !("timezoneOffsetMinutes" in body) ||
    typeof body.comment !== "string" || body.comment.length > 500 ||
    typeof body.timezoneOffsetMinutes !== "number" || !Number.isInteger(body.timezoneOffsetMinutes) ||
    Math.abs(body.timezoneOffsetMinutes) > 840) {
    return NextResponse.json({ error: "Некорректные данные квадрата." }, { status: 400 });
  }
  try {
    return NextResponse.json(await addSquare(body.comment, body.timezoneOffsetMinutes), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить квадрат в файл." }, { status: 500 });
  }
}
