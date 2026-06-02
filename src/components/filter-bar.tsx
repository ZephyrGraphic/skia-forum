import { Search } from "lucide-react";

import { cn, getTypeLabel } from "@/lib/utils";

const postTypes = ["DISCUSSION", "GUIDE", "NEWS", "QUESTION", "RECRUITMENT"];

type FilterBarProps = {
  activeType?: string;
  query?: string;
  category?: string;
  tag?: string;
};

export function FilterBar({ activeType, query, category, tag }: FilterBarProps) {
  return (
    <div className="filter-surface">
      <form className="search-form" action="/">
        {category ? <input name="category" type="hidden" value={category} /> : null}
        {tag ? <input name="tag" type="hidden" value={tag} /> : null}
        {activeType ? <input name="type" type="hidden" value={activeType} /> : null}
        <Search size={18} />
        <input
          defaultValue={query}
          name="q"
          placeholder="Cari build, stage, boss, guild..."
          type="search"
        />
        <button className="button button-muted" type="submit">
          Cari
        </button>
      </form>

      <div className="segmented-tabs" aria-label="Filter tipe thread">
        <a
          className={cn(!activeType && "is-active")}
          href={category ? `/?category=${category}` : "/"}
        >
          Semua
        </a>
        {postTypes.map((type) => {
          const params = new URLSearchParams();

          params.set("type", type);
          if (category) params.set("category", category);
          if (tag) params.set("tag", tag);
          if (query) params.set("q", query);

          return (
            <a
              className={cn(activeType === type && "is-active")}
              href={`/?${params.toString()}`}
              key={type}
            >
              {getTypeLabel(type)}
            </a>
          );
        })}
      </div>
    </div>
  );
}
