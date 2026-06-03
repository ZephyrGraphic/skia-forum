import { Send } from "lucide-react";

import { createCommentAction } from "@/lib/actions";
import { loginPath, usernameSetupPath } from "@/lib/auth-routes";

type CommentFormProps = {
  postId: string;
  isLoggedIn: boolean;
  isBanned: boolean;
  pathname: string;
  needsProfile?: boolean;
};

export function CommentForm({
  postId,
  isLoggedIn,
  isBanned,
  pathname,
  needsProfile = false,
}: CommentFormProps) {
  if (isBanned) {
    return (
      <div className="reply-box muted-box">
        <strong>Akunmu sedang dibatasi dan tidak bisa ikut berdiskusi.</strong>
      </div>
    );
  }

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

  if (needsProfile) {
    return (
      <div className="reply-box muted-box">
        <strong>Lengkapi username forum sebelum ikut berdiskusi.</strong>
        <a className="button button-primary" href={usernameSetupPath(pathname)}>
          Lengkapi Profil
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
