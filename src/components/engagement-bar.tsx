import { Bookmark, ThumbsUp } from "lucide-react";

import {
  toggleBookmarkAction,
  toggleReactionAction,
} from "@/lib/actions";
import { cn, formatNumber } from "@/lib/utils";

type EngagementBarProps = {
  postId: string;
  pathname: string;
  reactions: number;
  bookmarks: number;
  hasReacted: boolean;
  hasBookmarked: boolean;
  isLoggedIn: boolean;
};

export function EngagementBar({
  postId,
  pathname,
  reactions,
  bookmarks,
  hasReacted,
  hasBookmarked,
  isLoggedIn,
}: EngagementBarProps) {
  return (
    <div className="engagement-bar">
      <form action={toggleReactionAction}>
        <input name="postId" type="hidden" value={postId} />
        <input name="pathname" type="hidden" value={pathname} />
        <button
          className={cn("button", hasReacted ? "button-primary" : "button-muted")}
          disabled={!isLoggedIn}
          type="submit"
        >
          <ThumbsUp size={18} />
          {formatNumber(reactions)}
        </button>
      </form>
      <form action={toggleBookmarkAction}>
        <input name="postId" type="hidden" value={postId} />
        <input name="pathname" type="hidden" value={pathname} />
        <button
          className={cn(
            "button",
            hasBookmarked ? "button-primary" : "button-muted",
          )}
          disabled={!isLoggedIn}
          type="submit"
        >
          <Bookmark size={18} />
          {formatNumber(bookmarks)}
        </button>
      </form>
    </div>
  );
}
