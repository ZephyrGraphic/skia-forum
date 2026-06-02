import Link from "next/link";
import {
  BookOpen,
  CircleHelp,
  Newspaper,
  Shield,
  Sparkles,
} from "lucide-react";

import type { ForumCategory } from "@/lib/forum-types";
import { cn, formatNumber } from "@/lib/utils";

const iconMap = {
  "book-open": BookOpen,
  "circle-help": CircleHelp,
  newspaper: Newspaper,
  shield: Shield,
  sparkles: Sparkles,
};

type CategoryNavProps = {
  categories: ForumCategory[];
  activeSlug?: string;
};

export function CategoryNav({ categories, activeSlug }: CategoryNavProps) {
  return (
    <aside className="category-panel">
      <div className="panel-heading">
        <span>Kategori</span>
      </div>
      <div className="category-list">
        <Link
          className={cn("category-item", !activeSlug && "is-active")}
          href="/"
        >
          <span className="category-icon all">
            <Sparkles size={17} />
          </span>
          <span>
            <strong>Semua Thread</strong>
            <small>Seluruh board</small>
          </span>
        </Link>
        {categories.map((category) => {
          const Icon = iconMap[category.icon as keyof typeof iconMap] ?? Sparkles;

          return (
            <Link
              className={cn(
                "category-item",
                activeSlug === category.slug && "is-active",
              )}
              href={`/?category=${category.slug}`}
              key={category.slug}
              style={{ "--accent": category.accent } as React.CSSProperties}
            >
              <span className="category-icon">
                <Icon size={17} />
              </span>
              <span>
                <strong>{category.name}</strong>
                <small>{formatNumber(category._count.posts)} thread</small>
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
