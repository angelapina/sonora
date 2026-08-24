"use client";

import { useActionState } from "react";
import { updateProfile, type ActionState } from "@/lib/actions/musician";
import { CITIES } from "@/lib/taxonomy-data";

const initialState: ActionState = { ok: false };

type Taxonomy = { slug: string; label: string; icon?: string | null }[];

type ProfileData = {
  stageName: string;
  tagline: string | null;
  bio: string | null;
  city: string;
  zone: string | null;
  priceFrom: number | null;
  priceNote: string | null;
  yearsExperience: number | null;
  website: string | null;
  instagram: string | null;
  youtube: string | null;
  tiktok: string | null;
  spotify: string | null;
  phone: string | null;
  contactEmail: string | null;
};

function CheckboxGroup({
  name,
  options,
  selected,
}: {
  name: string;
  options: Taxonomy;
  selected: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label
          key={o.slug}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium has-[:checked]:border-coral has-[:checked]:bg-coral/10 has-[:checked]:text-coral-dark"
        >
          <input
            type="checkbox"
            name={name}
            value={o.slug}
            defaultChecked={selected.includes(o.slug)}
            className="sr-only"
          />
          {o.icon} {o.label}
        </label>
      ))}
    </div>
  );
}

export function ProfileEditForm({
  profile,
  artistTypes,
  genres,
  eventTypes,
  instruments,
  selected,
}: {
  profile: ProfileData;
  artistTypes: Taxonomy;
  genres: Taxonomy;
  eventTypes: Taxonomy;
  instruments: Taxonomy;
  selected: { artistTypes: string[]; genres: string[]; eventTypes: string[]; instruments: string[] };
}) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Nombre artístico
          </label>
          <input
            name="stageName"
            defaultValue={profile.stageName}
            required
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Frase corta (tagline)
          </label>
          <input
            name="tagline"
            defaultValue={profile.tagline ?? ""}
            maxLength={140}
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
      </section>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Biografía
        </label>
        <textarea
          name="bio"
          rows={5}
          defaultValue={profile.bio ?? ""}
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
        />
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Ciudad
          </label>
          <select
            name="city"
            defaultValue={profile.city}
            required
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          >
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Zona / se desplaza a
          </label>
          <input
            name="zone"
            defaultValue={profile.zone ?? ""}
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Precio desde (€)
          </label>
          <input
            type="number"
            name="priceFrom"
            min={0}
            defaultValue={profile.priceFrom ?? ""}
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Nota sobre el precio
          </label>
          <input
            name="priceNote"
            defaultValue={profile.priceNote ?? ""}
            placeholder="Según duración, desplazamiento…"
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
      </section>

      <div className="max-w-[180px]">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Años de experiencia
        </label>
        <input
          type="number"
          name="yearsExperience"
          min={0}
          defaultValue={profile.yearsExperience ?? ""}
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
        />
      </div>

      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Tipo de artista
        </p>
        <CheckboxGroup name="artistTypes" options={artistTypes} selected={selected.artistTypes} />
        {state.fieldErrors?.artistTypes && (
          <p className="mt-1 text-xs text-coral-dark">{state.fieldErrors.artistTypes[0]}</p>
        )}
      </section>

      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Géneros musicales
        </p>
        <CheckboxGroup name="genres" options={genres} selected={selected.genres} />
        {state.fieldErrors?.genres && (
          <p className="mt-1 text-xs text-coral-dark">{state.fieldErrors.genres[0]}</p>
        )}
      </section>

      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Instrumentos
        </p>
        <CheckboxGroup name="instruments" options={instruments} selected={selected.instruments} />
      </section>

      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Tipos de evento que realizas
        </p>
        <CheckboxGroup name="eventTypes" options={eventTypes} selected={selected.eventTypes} />
        {state.fieldErrors?.eventTypes && (
          <p className="mt-1 text-xs text-coral-dark">{state.fieldErrors.eventTypes[0]}</p>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Teléfono
          </label>
          <input
            name="phone"
            defaultValue={profile.phone ?? ""}
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Email de contacto
          </label>
          <input
            name="contactEmail"
            defaultValue={profile.contactEmail ?? ""}
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Web personal
          </label>
          <input
            name="website"
            defaultValue={profile.website ?? ""}
            placeholder="https://"
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Instagram
          </label>
          <input
            name="instagram"
            defaultValue={profile.instagram ?? ""}
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            YouTube
          </label>
          <input
            name="youtube"
            defaultValue={profile.youtube ?? ""}
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Spotify
          </label>
          <input
            name="spotify"
            defaultValue={profile.spotify ?? ""}
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
          />
        </div>
      </section>

      {state.message && (
        <p className={state.ok ? "text-sm text-ink" : "text-sm text-coral-dark"}>{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-coral px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-coral-dark disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
