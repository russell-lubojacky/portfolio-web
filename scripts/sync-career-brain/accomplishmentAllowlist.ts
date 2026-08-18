/**
 * accomplishments/ai.md documents an explicitly-flagged gap: the source resume claims
 * "AI/ML experimentation and deployment" with zero supporting project evidence anywhere
 * in career-brain (see that file's own Notes). Excluding it here is the concrete
 * mechanism preventing that unevidenced claim from reaching the public site — do not
 * remove this entry without first checking whether real project evidence has been added.
 */
export const EXCLUDED_ACCOMPLISHMENT_SLUGS = new Set<string>(["ai"]);
