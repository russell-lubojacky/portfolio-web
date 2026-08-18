import { Hero } from "@/components/hero/Hero";
import { Contact } from "@/components/contact/Contact";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Timeline } from "@/components/timeline/Timeline";
import { SkillsChart } from "@/components/skills/SkillsChart";
import { LeadershipSection } from "@/components/leadership/LeadershipSection";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/lib/content";

export default function Home() {
  const recentProjects = projects.slice(0, 3);

  return (
    <>
      <Hero />

      <Section id="timeline" eyebrow="Career" title="25+ years, one engagement at a time">
        <Timeline />
      </Section>

      <Section id="skills" eyebrow="Capabilities" title="Skills, rated honestly">
        <p className="max-w-2xl text-muted">
          Self-assessed strength levels from the source resume, backed by real project
          evidence — expand a skill to see it. Nothing here is rated higher than the
          underlying engagements support.
        </p>
        <div className="mt-8">
          <SkillsChart />
        </div>
      </Section>

      <Section eyebrow="Selected Work" title="Recent engagements">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recentProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <div className="mt-8">
          <Button href="/projects" variant="secondary">
            View all case studies
          </Button>
        </div>
      </Section>

      <Section id="leadership" eyebrow="Beyond the code" title="Leadership & accomplishments">
        <LeadershipSection />
      </Section>

      <Contact />
    </>
  );
}
