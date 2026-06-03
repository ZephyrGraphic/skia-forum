import Link from "next/link";
import {
  BookOpen,
  CircleHelp,
  Home,
  Newspaper,
  Plus,
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
      <div className="commander-card">
        <span className="commander-avatar">
          <Shield size={24} />
        </span>
        <span>
          <strong>Tactical Command</strong>
          <small>Elite Member</small>
        </span>
      </div>
      <div className="category-list">
        <Link
          className={cn("category-item", !activeSlug && "is-active")}
          href="/"
        >
          <span className="category-icon all">
            <Home size={18} />
          </span>
          <span>
            <strong>Home</strong>
            <small>Semua Thread</small>
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
      <Link className="button button-primary sidebar-compose" href="/compose">
        <Plus size={18} />
        Post Thread
      </Link>
    </aside>
  );
}
