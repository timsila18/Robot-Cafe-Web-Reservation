import { Star } from "lucide-react";

export default function ReviewCard({ review }) {
  return (
    <article className="glass-panel rounded-3xl p-7">
      <div className="flex gap-1 text-robot-gold" aria-label={`${review.rating} star rating`}>
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="mt-6 text-lg leading-8 text-white">"{review.quote}"</p>
      <div className="mt-7 border-t border-white/10 pt-5">
        <p className="font-bold text-white">{review.name}</p>
        <p className="text-sm text-robot-muted">{review.role}</p>
      </div>
    </article>
  );
}
