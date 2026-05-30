import PremiumButton from "../components/PremiumButton";

export default function NotFoundPage() {
  return (
    <section className="grid min-h-[60vh] place-items-center px-5 py-24 text-center">
      <div>
        <h1 className="font-display text-5xl font-bold text-white">Page not found</h1>
        <p className="mt-4 text-robot-muted">Return to the familiar Robot Cafe journey.</p>
        <PremiumButton as="a" href="/" className="mt-8">
          Go Home
        </PremiumButton>
      </div>
    </section>
  );
}
