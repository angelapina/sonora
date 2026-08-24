import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg", "audio/x-m4a"];

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "MUSICIAN" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo no válido" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "El archivo supera los 15MB" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Formato no permitido" }, { status: 400 });
  }

  const ext = path.extname(file.name) || "";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", session.user.id);
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, safeName), buffer);

  return NextResponse.json({ url: `/uploads/${session.user.id}/${safeName}` });
}
