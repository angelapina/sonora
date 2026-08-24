"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerClientSchema, registerMusicianSchema } from "@/lib/validations";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function registerClient(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = Object.fromEntries(formData);
  const parsed = registerClientSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return { ok: false, message: "Ya existe una cuenta con ese email." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email: email.toLowerCase(), passwordHash, role: "CLIENT" },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, message: "Cuenta creada, pero no hemos podido iniciar sesión automáticamente. Prueba a entrar desde /login." };
    }
    throw error;
  }
  return { ok: true };
}

export async function registerMusician(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = Object.fromEntries(formData);
  const parsed = registerMusicianSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { stageName, email, password, city } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return { ok: false, message: "Ya existe una cuenta con ese email." };
  }

  let slug = slugify(stageName);
  const slugTaken = await prisma.musicianProfile.findUnique({ where: { slug } });
  if (slugTaken) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name: stageName,
      email: email.toLowerCase(),
      passwordHash,
      role: "MUSICIAN",
      musicianProfile: {
        create: {
          slug,
          stageName,
          city,
          status: "draft",
        },
      },
    },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, message: "Cuenta creada, pero no hemos podido iniciar sesión automáticamente. Prueba a entrar desde /login." };
    }
    throw error;
  }
  return { ok: true };
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/");

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { ok: false, message: "Email o contraseña incorrectos." };
      }
      return { ok: false, message: "No hemos podido iniciar sesión. Inténtalo de nuevo." };
    }
    throw error; // deja pasar el redirect de next-auth en caso de éxito
  }
  return { ok: true };
}
