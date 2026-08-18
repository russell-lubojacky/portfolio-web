import path from "node:path";
import fs from "node:fs";
import { loadClients, buildProjectClientMap } from "./anonymize";
import { parseProjects } from "./parseProjects";
import { parseSkills } from "./parseSkills";
import { parseLeadership } from "./parseLeadership";
import { parseAccomplishments } from "./parseAccomplishments";
import { writeAll } from "./write";

function resolveCareerBrainPath(): string {
  const fromEnv = process.env.CAREER_BRAIN_PATH;
  const candidate = fromEnv
    ? path.resolve(process.cwd(), fromEnv)
    : path.resolve(process.cwd(), "..", "ai-lab", "career-brain");
  if (!fs.existsSync(path.join(candidate, "ARCHITECTURE.md"))) {
    throw new Error(
      `career-brain not found at ${candidate}. Set CAREER_BRAIN_PATH to the correct path.`,
    );
  }
  return candidate;
}

function main() {
  const careerBrainPath = resolveCareerBrainPath();
  console.log(`Syncing from ${careerBrainPath}`);

  const clients = loadClients(careerBrainPath);
  const projectClientMap = buildProjectClientMap(clients);

  const { records: projects, slugMap } = parseProjects(careerBrainPath, projectClientMap);
  const skills = parseSkills(careerBrainPath, clients, slugMap);
  const leadership = parseLeadership(careerBrainPath, clients, slugMap);
  const accomplishments = parseAccomplishments(careerBrainPath, clients, slugMap);

  writeAll({ projects, skills, leadership, accomplishments, careerBrainPath });

  console.log(
    `Wrote ${projects.length} projects, ${skills.length} skills, ${leadership.length} leadership themes, ${accomplishments.length} accomplishments to content/generated/`,
  );
}

main();
