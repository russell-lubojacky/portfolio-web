import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Job Fit — Russell Lubojacky",
  description: "Paste a job description and see how it lines up against a real, documented career history.",
};

export default function FitPage() {
  return (
    <Section
      eyebrow="Coming Soon"
      title="Paste a job description, get a real fit score"
    >
      <div className="max-w-2xl space-y-4 text-muted">
        <p>
          I&apos;m building a tool that compares a pasted job description against my
          actual documented project history — not a generic keyword match, but a
          score grounded in the real skills and engagements on this site, with the
          gaps called out honestly instead of glossed over.
        </p>
        <p>
          It&apos;s not live yet. In the meantime, take a look at the case studies
          and skills below, or reach out directly.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button href="/projects" variant="secondary">
          Browse case studies
        </Button>
        <Button href="/#skills" variant="secondary">
          See skills
        </Button>
        <Button href="mailto:russell.lubojacky@gmail.com">Email me instead</Button>
      </div>
    </Section>
  );
}
