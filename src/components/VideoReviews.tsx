import { useState } from "react";
import { VIDEO_REVIEWS } from "../data/content";

function VideoCard({ src, poster, label }: { src: string; poster: string; label: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-xl2 bg-black shadow-card">
      {playing ? (
        <video
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          className="aspect-[3/4] w-full bg-black object-contain"
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="group relative block aspect-[3/4] w-full"
          aria-label={`Смотреть: ${label}`}
        >
          <img src={poster} alt={label} loading="lazy" className="h-full w-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-brand shadow-glow transition-transform group-hover:scale-110">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="absolute inset-x-0 bottom-0 p-4 text-left text-sm font-extrabold text-white">
            {label}
          </span>
        </button>
      )}
    </div>
  );
}

export default function VideoReviews() {
  if (!VIDEO_REVIEWS.length) return null;
  return (
    <section className="section">
      <div className="container-p">
        <div className="text-center">
          <span className="eyebrow">Видео-отзывы</span>
          <h2 className="h2 mt-3">Живые эмоции детей и родителей</h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink/60">
            Никакой постановки — как есть. Нажмите, чтобы посмотреть.
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {VIDEO_REVIEWS.map((v) => (
            <VideoCard key={v.src} {...v} />
          ))}
        </div>
      </div>
    </section>
  );
}
