import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="border-b border-border py-24 sm:py-32">
      <Container>
        <div className="flex flex-col-reverse items-start gap-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-sm tracking-widest text-primary uppercase">
              Technical Architecture Manager · Houston, TX
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
              25 years architecting systems that shipped. Now building with AI, not just about it.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              I design and deliver cloud-native, API, and enterprise integration platforms —
              from Fortune 500 hospitality and banking systems to a live AWS/Kubernetes
              modernization for a federal weather and environmental agency, built with Claude
              Code as part of the delivery team, not just the tooling.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/fit">See how I fit your role</Button>
              <Button href="/projects" variant="secondary">
                Browse case studies
              </Button>
            </div>
          </div>
          <img
            src="/headshot.jpg"
            alt="Russell Lubojacky"
            width={176}
            height={176}
            className="h-32 w-32 shrink-0 rounded-lg border border-border object-cover sm:h-44 sm:w-44"
          />
        </div>
      </Container>
    </section>
  );
}
