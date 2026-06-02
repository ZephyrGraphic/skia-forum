import Link from "next/link";
import {
  Bookmark,
  Eye,
  MessageCircle,
  Pin,
  Sparkles,
  ThumbsUp,
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
  return (
    <article
      className={cn("post-card", post.pinned && "post-card-pinned")}
      style={{ "--accent": post.category.accent } as React.CSSProperties}
    >
      <div className="post-card-accent" />
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
              Pinned
            </span>
          ) : null}
          {post.featured ? (
            <span className="mini-status">
              <Sparkles size={14} />
              Featured
            </span>
          ) : null}
        </div>

        <Link className="post-title-link" href={`/p/${post.slug}`}>
          <h2>{post.title}</h2>
        </Link>
        <p>{excerpt(post.body)}</p>

        <div className="tag-row">
          {post.postTags.map(({ tag }) => (
            <Link href={`/?tag=${tag.slug}`} key={tag.slug}>
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="post-card-side">
        <div className="author-line">
          <Avatar image={post.author.image} name={post.author.name} size="sm" />
          <span>{post.author.name ?? "Member"}</span>
        </div>
        <span className="time-label">{timeAgo(post.createdAt)}</span>
        <div className="metric-grid">
          <span>
            <MessageCircle size={15} />
            {formatNumber(post._count.comments)}
          </span>
          <span>
            <ThumbsUp size={15} />
            {formatNumber(post._count.reactions)}
          </span>
          <span>
            <Bookmark size={15} />
            {formatNumber(post._count.bookmarks)}
          </span>
          <span>
            <Eye size={15} />
            {formatNumber(post.views)}
          </span>
        </div>
      </div>
    </article>
  );
}
