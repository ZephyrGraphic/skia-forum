import Image from "next/image";

import { getInitials } from "@/lib/utils";

type AvatarProps = {
  name?: string | null;
  image?: string | null;
  size?: "sm" | "md" | "lg";
};

export function Avatar({ name, image, size = "md" }: AvatarProps) {
  const dimensions = {
    sm: 30,
    md: 44,
    lg: 72,
  };

  return (
    <span className={`avatar avatar-${size}`} aria-hidden="true">
      {image ? (
        <Image
          alt=""
          className="avatar-image"
          height={dimensions[size]}
          referrerPolicy="no-referrer"
          src={image}
          unoptimized={image.includes("dicebear") || image.includes(".svg")}
          width={dimensions[size]}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </span>
  );
}
