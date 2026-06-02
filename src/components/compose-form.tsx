import { Send } from "lucide-react";

import { createPostAction } from "@/lib/actions";
import type { ForumCategory } from "@/lib/forum-types";

type ComposeFormProps = {
  categories: ForumCategory[];
};

export function ComposeForm({ categories }: ComposeFormProps) {
  return (
    <form className="compose-form" action={createPostAction}>
      <label>
        <span>Judul thread</span>
        <input
          maxLength={120}
          minLength={8}
          name="title"
          placeholder="Contoh: Prioritas upgrade hero untuk stage menengah"
          required
          type="text"
        />
      </label>

      <div className="form-grid">
        <label>
          <span>Kategori</span>
          <select name="categoryId" required>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Tipe</span>
          <select name="type" required>
            <option value="DISCUSSION">Diskusi</option>
            <option value="GUIDE">Panduan</option>
            <option value="NEWS">Info</option>
            <option value="QUESTION">Tanya</option>
            <option value="RECRUITMENT">Guild</option>
          </select>
        </label>
      </div>

      <label>
        <span>Isi thread</span>
        <textarea
          maxLength={6000}
          minLength={24}
          name="body"
          placeholder="Tulis detail, konteks akun, komposisi tim, atau pertanyaanmu..."
          required
          rows={12}
        />
      </label>

      <label>
        <span>Tag</span>
        <input
          maxLength={120}
          name="tags"
          placeholder="boss, farming, newbie"
          type="text"
        />
      </label>

      <div className="form-actions">
        <button className="button button-primary" type="submit">
          <Send size={18} />
          Posting Thread
        </button>
      </div>
    </form>
  );
}
