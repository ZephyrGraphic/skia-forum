import Link from "next/link";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Eye,
  MessageCircle,
  Pin,
  Sparkles,
} from "lucide-react";

import { Avatar } from "@/components/avatar";
import type { ForumPost } from "@/lib/forum-types";
import {
  cn,
  excerpt,
  formatNumber,
  getTypeLabel,
  getTypeTone,
  timeAgo,
} from "@/lib/utils";

type PostCardProps = {
  post: ForumPost;
};

export function PostCard({ post }: PostCardProps) {
  const authorName = post.author.username ?? "Member";

  return (
    <article
      className={cn("post-card", post.pinned && "post-card-pinned")}
      style={{ "--accent": post.category.accent } as React.CSSProperties}
    >
      <div className="post-card-accent" />
      <div className="vote-rail">
        <ChevronUp size={20} />
        <strong>{formatNumber(post._count.reactions)}</strong>
        <ChevronDown size={20} />
      </div>
      <div className="post-card-main">
        <div className="post-meta-row">
          <Link
            className="category-pill"
            href={`/?category=${post.category.slug}`}
          >
            {post.category.name}
          </Link>
          <span className={cn("type-pill", getTypeTone(post.type))}>
            {getTypeLabel(post.type)}
          </span>
          {post.pinned ? (
            <span className="mini-status">
              <Pin size={14} />
              Disematkan
            </span>
          ) : null}
          {post.featured ? (
            <span className="mini-status">
              <Sparkles size={14} />
              Sorotan
            </span>
          ) : null}
          <span className="thread-author-inline">
            <Avatar image={post.author.image} name={authorName} size="sm" />
            {authorName}
          </span>
          <span className="time-label">{timeAgo(post.createdAt)}</span>
        </div>

        <Link className="post-title-link" href={`/p/${post.slug}`}>
          <h2>{post.title}</h2>
        </Link>
        <p>{excerpt(post.body)}</p>

        <div className="post-action-row">
          <span>
            <MessageCircle size={17} />
            {formatNumber(post._count.comments)} Komentar
          </span>
          <span>
            <Eye size={17} />
            {formatNumber(post.views)} Dilihat
          </span>
          <span className="save-action">
            <Bookmark size={17} />
            Simpan
          </span>
        </div>
      </div>
    </article>
  );
}
