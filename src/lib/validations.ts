import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Introduce un email válido"),
  password: z.string().min(1, "Introduce tu contraseña"),
});

export const registerClientSchema = z
  .object({
    name: z.string().min(2, "Introduce tu nombre"),
    email: z.string().email("Introduce un email válido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(8, "Mínimo 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const registerMusicianSchema = z
  .object({
    stageName: z.string().min(2, "Introduce tu nombre artístico"),
    email: z.string().email("Introduce un email válido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(8, "Mínimo 8 caracteres"),
    city: z.string().min(2, "Indica tu ciudad"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const bookingRequestSchema = z.object({
  musicianId: z.string().min(1),
  guestName: z.string().min(2, "Introduce tu nombre"),
  guestEmail: z.string().email("Introduce un email válido"),
  guestPhone: z.string().optional(),
  eventType: z.string().min(1, "Selecciona un tipo de evento"),
  eventDate: z.string().optional(),
  city: z.string().optional(),
  budgetMin: z.coerce.number().optional(),
  budgetMax: z.coerce.number().optional(),
  message: z.string().min(5, "Cuéntanos algo sobre tu evento"),
});

export const reviewSchema = z.object({
  musicianId: z.string().min(1),
  bookingRequestId: z.string().optional(),
  authorName: z.string().min(2),
  eventType: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(5, "Cuéntanos tu experiencia"),
});

export const profileUpdateSchema = z.object({
  stageName: z.string().min(2),
  tagline: z.string().max(140).optional(),
  bio: z.string().max(2000).optional(),
  city: z.string().min(2),
  zone: z.string().optional(),
  priceFrom: z.coerce.number().min(0).optional(),
  priceNote: z.string().optional(),
  yearsExperience: z.coerce.number().min(0).optional(),
  website: z.string().url().optional().or(z.literal("")),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  spotify: z.string().optional(),
  phone: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  artistTypes: z.array(z.string()).min(1, "Selecciona al menos un tipo de artista"),
  genres: z.array(z.string()).min(1, "Selecciona al menos un género"),
  eventTypes: z.array(z.string()).min(1, "Selecciona al menos un tipo de evento"),
  instruments: z.array(z.string()).optional(),
});
