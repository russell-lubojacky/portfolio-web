import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export function Contact() {
  return (
    <Section id="contact" eyebrow="Let's talk" title="Open to roles and contracts">
      <p className="max-w-xl text-muted">
        Reach out directly, or paste a job description into the fit tool first to see
        exactly where my background lines up.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button href="mailto:russell.lubojacky@gmail.com">Email me</Button>
        <Button href="https://www.linkedin.com/in/rdlubojacky/" variant="secondary">
          Connect on LinkedIn
        </Button>
      </div>
    </Section>
  );
}
