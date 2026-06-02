import { Send } from "lucide-react";

import { createCommentAction } from "@/lib/actions";
import { loginPath } from "@/lib/auth-routes";

type CommentFormProps = {
  postId: string;
  isLoggedIn: boolean;
  pathname: string;
};

export function CommentForm({ postId, isLoggedIn, pathname }: CommentFormProps) {
  if (!isLoggedIn) {
    return (
      <div className="reply-box muted-box">
        <strong>Login Google untuk ikut berdiskusi.</strong>
        <a className="button button-primary" href={loginPath(pathname)}>
          Login
        </a>
      </div>
    );
  }

  return (
    <form className="reply-form" action={createCommentAction}>
      <input name="postId" type="hidden" value={postId} />
      <label>
        <span>Komentar</span>
        <textarea
          maxLength={1600}
          minLength={3}
          name="body"
          placeholder="Balas dengan saran, pengalaman, atau data akunmu..."
          required
          rows={5}
        />
      </label>
      <button className="button button-primary" type="submit">
        <Send size={18} />
        Kirim Komentar
      </button>
    </form>
  );
}
