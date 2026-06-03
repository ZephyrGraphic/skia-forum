import Link from "next/link";
import { Bookmark, MessageCircle, ThumbsUp } from "lucide-react";

import { DeletePostForm } from "@/components/delete-post-form";
import type { ForumPost } from "@/lib/forum-types";
import {
  cn,
  formatNumber,
  getTypeLabel,
  getTypeTone,
  timeAgo,
} from "@/lib/utils";

type ProfilePostRowProps = {
  canDelete?: boolean;
  post: ForumPost;
  returnTo?: string;
};

export function ProfilePostRow({
  canDelete = false,
  post,
  returnTo = "/me",
}: ProfilePostRowProps) {
  return (
    <article
      className="profile-post-row"
      style={{ "--accent": post.category.accent } as React.CSSProperties}
    >
      <Link className="profile-post-main" href={`/p/${post.slug}`}>
        <div className="profile-row-meta">
          <span className="category-pill">{post.category.name}</span>
          <span className={cn("type-pill", getTypeTone(post.type))}>
            {getTypeLabel(post.type)}
          </span>
          <span>{timeAgo(post.createdAt)}</span>
        </div>
        <h3>{post.title}</h3>
      </Link>

      <div className="profile-row-side">
        <span>
          <ThumbsUp size={15} />
          {formatNumber(post._count.reactions)}
        </span>
        <span>
          <MessageCircle size={15} />
          {formatNumber(post._count.comments)}
        </span>
        <span>
          <Bookmark size={15} />
          {formatNumber(post._count.bookmarks)}
        </span>
        {canDelete ? (
          <DeletePostForm
            pathname="/me"
            postId={post.id}
            returnTo={returnTo}
          />
        ) : null}
      </div>
    </article>
  );
}
