import { Save } from "lucide-react";

import { updateProfileAction } from "@/lib/actions";

type ProfileFormProps = {
  bio?: string | null;
  callbackUrl: string;
  submitLabel?: string;
  username?: string | null;
};

export function ProfileForm({
  bio,
  callbackUrl,
  submitLabel = "Simpan Profil",
  username,
}: ProfileFormProps) {
  return (
    <form className="profile-form" action={updateProfileAction}>
      <input name="callbackUrl" type="hidden" value={callbackUrl} />

      <label>
        <span>Username forum</span>
        <input
          autoComplete="username"
          autoFocus={!username}
          defaultValue={username ?? ""}
          maxLength={24}
          minLength={3}
          name="username"
          pattern="[A-Za-z0-9][A-Za-z0-9_.-]{2,23}"
          placeholder="contoh: lucius_idle"
          required
          title="3-24 karakter. Gunakan huruf, angka, titik, strip, atau underscore."
          type="text"
        />
      </label>

      <label>
        <span>Bio singkat</span>
        <textarea
          defaultValue={bio ?? ""}
          maxLength={180}
          name="bio"
          placeholder="Strategist, guide maker, atau role favoritmu di SKIA."
          rows={4}
        />
      </label>

      <div className="form-actions">
        <button className="button button-primary" type="submit">
          <Save size={18} />
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
