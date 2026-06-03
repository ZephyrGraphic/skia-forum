"use client";

import { Trash2 } from "lucide-react";

import { deletePostAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

type DeletePostFormProps = {
  buttonLabel?: string;
  pathname: string;
  postId: string;
  returnTo: string;
  variant?: "compact" | "full";
};

export function DeletePostForm({
  buttonLabel = "Hapus",
  pathname,
  postId,
  returnTo,
  variant = "compact",
}: DeletePostFormProps) {
  return (
    <form
      action={deletePostAction}
      className={cn("delete-post-form", variant === "compact" && "is-compact")}
      onSubmit={(event) => {
        if (!window.confirm("Hapus thread ini secara permanen?")) {
          event.preventDefault();
        }
      }}
    >
      <input name="postId" type="hidden" value={postId} />
      <input name="pathname" type="hidden" value={pathname} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <button
        className={variant === "compact" ? "icon-button danger-icon" : "button button-danger"}
        title={buttonLabel}
        type="submit"
      >
        <Trash2 size={17} />
        {variant === "full" ? buttonLabel : null}
      </button>
    </form>
  );
}
