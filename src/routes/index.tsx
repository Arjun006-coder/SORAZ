import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Instagram, Sparkles } from "lucide-react";
import heroSnacks from "@/assets/soraz-hero-photo.jpg";
import japanSnacks from "@/assets/japan-snacks.jpg";
import koreaSnacks from "@/assets/korea-snacks.jpg";
import asiaSnacks from "@/assets/china-thailand-snacks.jpg";
import { Reveal } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";
import { WaitlistForm } from "@/components/waitlist-form";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SORAZ — Asian Pop-Culture Snacks in India" },
      {
        name: "description",
        content:
          "Discover SORAZ: viral Japanese, Korean, Chinese and Thai snacks reimagined for India. Join the first drop.",
      },
      { property: "og:title", content: "SORAZ — Snack Outside the Script" },
      {
        property: "og:description",
        content: "The snacks from anime, K-dramas, C-dramas and your feed—coming to India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const INSTAGRAM = "sorafizz";

const cultureDrops = [
  {
    country: "Korea",
    issue: "SEOUL / 01",
    title: "Drama-night cravings",
    copy: "The red-sauce cup, the impossible cheese pull, the glass-crack fruit skewer. Street-food scenes made these global comfort food.",
    snacks: ["Tteokbokki", "Korean corn dogs", "Fruit tanghulu"],
    image: koreaSnacks,
    imageAlt: "Tteokbokki, Korean corn dog and colorful fruit tanghulu",
    color: "bg-coral",
  },
  {
    country: "Japan",
    issue: "TOKYO / 02",
    title: "Konbini main characters",
    copy: "Festival episodes, school-break runs and late-night convenience stores—the classics you recognise before the first bite.",
    snacks: ["Ramune", "Taiyaki", "Mitarashi dango"],
    image: japanSnacks,
    imageAlt: "Ramune, taiyaki, onigiri and dango on a chrome counter",
    color: "bg-sky",
  },
  {
    country: "China + Thailand",
    issue: "SHANGHAI / BANGKOK / 03",
    title: "Feed-famous flavours",
    copy: "From C-drama nostalgia to Bangkok night-market staples: bold texture, big colour and snacks worth pausing for.",
    snacks: ["Haw flakes + milk candy", "Thai seaweed crisps", "Mango sticky rice + milk tea"],
    image: asiaSnacks,
    imageAlt: "Tanghulu, mango sticky rice, Thai milk tea and crispy seaweed",
    color: "bg-acid",
  },
];

function Home() {
  return (
    <main className="overflow-hidden bg-background">
      <Nav />
      <Hero />
      <Ticker />
      <CultureDrops />
      <Manifesto />
      <Waitlist />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-ink bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-7">
        <a href="#top" className="font-display text-2xl uppercase text-ink sm:text-3xl">
          SORAZ<span className="text-coral">*</span>
        </a>
        <nav className="hidden items-center gap-8 font-mono text-xs font-bold uppercase md:flex" aria-label="Main navigation">
          <a href="#drops" className="nav-link">The drop</a>
          <a href="#story" className="nav-link">Why SORAZ</a>
          <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer" className="nav-link">Instagram</a>
        </nav>
        <a href="#waitlist" className="border-2 border-ink bg-acid px-4 py-2 font-mono text-xs font-bold uppercase shadow-mini transition-transform hover:-translate-y-0.5">
          Get first dibs
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[92svh] border-b-2 border-ink pt-16">
      <img
        src={heroSnacks}
        alt="Colorful spread of Asian snacks including ramune, mochi, dango, taiyaki, onigiri and matcha"
        width={1600}
        height={1200}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="hero-shade absolute inset-0" aria-hidden />
      <div className="relative z-10 mx-auto flex min-h-[calc(92svh-4rem)] max-w-[1440px] flex-col justify-between px-4 py-8 sm:px-7 sm:py-10">
        <div className="flex items-start justify-between gap-4">
          <p className="stamp rotate-negative">INDIA'S NEXT<br />SNACK DROP</p>
          <p className="max-w-48 border-2 border-ink bg-background px-3 py-2 font-mono text-[10px] font-bold uppercase leading-relaxed shadow-mini sm:max-w-64 sm:text-xs">
            Japan / Korea / China / Thailand<br />Coming soon to your shelf
          </p>
        </div>
        <div>
          <p className="mb-3 font-mono text-xs font-bold uppercase text-hero-foreground sm:text-sm">
            The screen-to-snack pipeline is real
          </p>
          <h1 className="hero-title max-w-6xl text-hero-foreground">
            SNACK OUTSIDE<br /><span className="text-acid">THE SCRIPT.</span>
          </h1>
          <div className="mt-6 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <p className="max-w-xl text-base font-semibold leading-relaxed text-hero-foreground sm:text-xl">
              The food you pause anime, K-dramas and viral clips for—made fresh, loud and ready for India.
            </p>
            <a href="#drops" aria-label="Explore the snack drop" className="grid size-16 shrink-0 place-items-center border-2 border-ink bg-coral text-primary-foreground shadow-brutal transition-all hover:rotate-6 hover:scale-105 sm:size-20">
              <ArrowDownRight className="size-8 sm:size-10" strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const words = "RAMUNE · TTEOKBOKKI · TAIYAKI · TANGHULU · DANGO · THAI MILK TEA · ";
  return (
    <div className="ticker border-b-2 border-ink bg-acid py-3" aria-label="Featured snacks">
      <div className="ticker-track font-display text-xl uppercase text-ink sm:text-3xl">
        <span>{words}</span><span aria-hidden>{words}</span><span aria-hidden>{words}</span>
      </div>
    </div>
  );
}

function CultureDrops() {
  return (
    <section id="drops" className="px-4 py-20 sm:px-7 sm:py-28">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="grid items-end gap-6 border-b-2 border-ink pb-8 md:grid-cols-[1fr_0.7fr]">
          <div>
            <p className="section-kicker">Not “Asian candy.” Actual cravings.</p>
            <h2 className="mt-4 max-w-4xl text-5xl uppercase leading-[0.92] text-ink sm:text-7xl lg:text-8xl">You saw it.<br />Now taste it.</h2>
          </div>
          <p className="max-w-xl text-lg font-semibold leading-relaxed text-muted-foreground md:justify-self-end">
            Specific snacks with a real story—not a vague country label and a random emoji. Each drop starts with food people already obsess over.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {cultureDrops.map((drop, index) => (
            <Reveal key={drop.country} delay={index * 80} className={index === 0 ? "lg:col-span-7" : index === 1 ? "lg:col-span-5 lg:mt-24" : "lg:col-span-8 lg:col-start-3"}>
              <TiltCard className="group border-2 border-ink bg-card shadow-brutal-lg">
                <article>
                  <div className="relative overflow-hidden border-b-2 border-ink">
                    <img src={drop.image} alt={drop.imageAlt} width={1200} height={912} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className={`absolute left-3 top-3 border-2 border-ink px-3 py-2 font-mono text-[10px] font-bold uppercase text-ink shadow-mini ${drop.color}`}>{drop.issue}</span>
                    <span className="absolute bottom-3 right-3 grid size-12 place-items-center border-2 border-ink bg-background shadow-mini transition-transform group-hover:rotate-12">
                      <ArrowUpRight className="size-6" />
                    </span>
                  </div>
                  <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-[0.8fr_1.2fr]">
                    <div>
                      <p className="font-mono text-xs font-bold uppercase text-coral">{drop.country}</p>
                      <h3 className="mt-2 text-3xl uppercase leading-none text-ink sm:text-4xl">{drop.title}</h3>
                    </div>
                    <div>
                      <p className="font-medium leading-relaxed text-muted-foreground">{drop.copy}</p>
                      <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${drop.country} snacks`}>
                        {drop.snacks.map((snack) => <li key={snack} className="border-2 border-ink bg-background px-3 py-1.5 font-mono text-[10px] font-bold uppercase">{snack}</li>)}
                      </ul>
                    </div>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section id="story" className="border-y-2 border-ink bg-ink px-4 py-20 text-background sm:px-7 sm:py-28">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div className="relative mx-auto w-full max-w-xl lg:mx-0">
              <div className="absolute -left-3 -top-4 z-10 bg-acid px-4 py-2 font-mono text-xs font-bold uppercase text-ink shadow-mini rotate-negative">Fresh, never import-stale</div>
              <img src={heroSnacks} alt="SORAZ snack spread photographed with bright direct flash" width={1600} height={1200} loading="lazy" className="aspect-square w-full border-2 border-background object-cover shadow-light" />
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase text-acid">Why SORAZ / Our take</p>
              <h2 className="mt-4 text-5xl uppercase leading-[0.92] text-background sm:text-7xl">Culture-forward.<br /><span className="text-coral">India-ready.</span></h2>
              <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed text-background/75 sm:text-xl">
                We grew up chasing these flavours through screens, only to find expensive imports that arrived tired. So SORAZ is building them here: honest ingredients, real references, and flavour balance tuned for Indian palates.
              </p>
              <div className="mt-10 grid grid-cols-2 border-l-2 border-t-2 border-background/30 sm:grid-cols-4">
                {[['04','food cultures'],['11','first-drop icons'],['00','boring basics'],['01','very loud shelf']].map(([number,label]) => (
                  <div key={label} className="border-b-2 border-r-2 border-background/30 p-4 sm:p-5">
                    <p className="font-display text-3xl text-acid sm:text-4xl">{number}</p>
                    <p className="mt-1 font-mono text-[10px] font-bold uppercase text-background/65">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Waitlist() {
  return (
    <section id="waitlist" className="relative px-4 py-20 sm:px-7 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <Reveal>
          <p className="section-kicker">Limited first drop</p>
          <h2 className="mt-4 text-5xl uppercase leading-[0.92] text-ink sm:text-7xl">Get in before it hits the feed.</h2>
          <p className="mt-6 max-w-md text-lg font-semibold leading-relaxed text-muted-foreground">Pick your cravings. We’ll use the votes to shape the first SORAZ shelf—and give the early list first access.</p>
          <div className="mt-8 inline-flex items-center gap-2 border-2 border-ink bg-gold px-4 py-3 font-mono text-xs font-bold uppercase shadow-mini rotate-positive">
            <Sparkles className="size-4" /> First-dib energy only
          </div>
        </Reveal>
        <Reveal delay={100}><WaitlistForm /></Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-coral px-4 py-10 sm:px-7">
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="font-display text-6xl uppercase leading-none text-primary-foreground sm:text-8xl">SORAZ*</p>
          <p className="mt-3 font-mono text-xs font-bold uppercase text-primary-foreground">Snack outside the script.</p>
        </div>
        <div className="flex flex-col gap-3 font-mono text-xs font-bold uppercase text-primary-foreground md:items-end">
          <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border-b-2 border-current pb-1"><Instagram className="size-4" /> @{INSTAGRAM}</a>
          <a href="mailto:hello@soraz.in" className="border-b-2 border-current pb-1">hello@soraz.in</a>
          <p>© {new Date().getFullYear()} SORAZ</p>
        </div>
      </div>
    </footer>
  );
}