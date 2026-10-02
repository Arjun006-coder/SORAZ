import { useRouter } from "@tanstack/react-router";
import { Heart, X } from "lucide-react";

interface SupportPopupProps {
  name: string;
  onClose: () => void;
}

export function SupportPopup({ name, onClose }: SupportPopupProps) {
  const router = useRouter();

  function handleYes() {
    router.navigate({ to: "/support" });
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md border-2 border-ink bg-card p-8 shadow-brutal animate-pop">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-1 text-muted-foreground transition-colors hover:text-ink"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <span className="grid size-14 place-items-center border-2 border-ink bg-coral text-primary-foreground shadow-mini">
            <Heart className="size-7" fill="currentColor" />
          </span>
        </div>

        {/* Copy */}
        <h3 className="mt-5 text-center text-2xl font-black uppercase text-ink leading-tight">
          Want to support the idea?
        </h3>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Hey{name ? ` ${name.split(" ")[0]}` : ""}! You're on the list 🎉
          <br />
          If you want to help SORAZ move faster, you can back us with a small
          contribution — any amount, directly via UPI. No pressure at all!
        </p>

        {/* Perks */}
        <ul className="mt-5 space-y-2">
          {[
            "Your name in our first batch thank-you post",
            "Priority pre-order before public launch",
            "Direct line to the founder",
          ].map((perk) => (
            <li key={perk} className="flex items-center gap-2 text-xs text-ink">
              <span className="size-2 shrink-0 bg-coral" />
              {perk}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleYes}
            className="flex-1 border-2 border-ink bg-coral px-5 py-3 font-display text-base font-black uppercase text-primary-foreground shadow-mini transition-all hover:-translate-y-0.5 hover:shadow-brutal"
          >
            Yes, I want to support! →
          </button>
          <button
            onClick={onClose}
            className="flex-1 border-2 border-ink bg-background px-5 py-3 font-display text-base font-black uppercase text-ink transition-all hover:-translate-y-0.5"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
