import BrandLogo from "./BrandLogo";

export default function LoadingBrand({ label = "Loading Robot Cafe..." }) {
  return (
    <section className="px-5 py-24 text-center">
      <div className="mx-auto flex max-w-sm flex-col items-center">
        <BrandLogo className="justify-center" imageClassName="h-16 max-w-[300px]" />
        <div className="mt-8 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-robot-blue to-robot-gold" />
        </div>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-robot-muted">{label}</p>
      </div>
    </section>
  );
}
