import Image from "next/image";

type HeroBackdropProps = {
  priority?: boolean;
};

export function HeroBackdrop({ priority = false }: HeroBackdropProps) {
  return (
    <div className="hero-image" aria-hidden="true">
      <Image
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        src="/images/skia-forum-hero.png"
      />
    </div>
  );
}
