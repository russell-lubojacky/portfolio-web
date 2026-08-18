/**
 * Best-effort scale descriptors from public knowledge, keyed by clients/<slug>.md.
 * career-brain has no "scale" field — only Industry. These labels are AI-suggested
 * defaults pending Russell's review (see plan open item #2), not sourced from
 * career-brain itself. Extra name aliases catch references career-brain's own
 * `# Client` field doesn't spell out (e.g. "NWS" for NOAA) for the redaction pass.
 */
export interface ClientMeta {
  scale: string;
  extraAliases?: string[];
}

export const CLIENT_SCALE: Record<string, ClientMeta> = {
  "1stbuy-com": { scale: "Early-stage e-commerce startup" },
  "accenture-internal": { scale: "Internal enterprise platform", extraAliases: ["ALSS", "INTIENT", "ALSS-INTIENT"] },
  "bristol-myers-squibb": { scale: "Fortune 500 pharmaceutical company" },
  "capital-group": { scale: "Global asset management firm" },
  "capital-one-finance": { scale: "Fortune 100 bank", extraAliases: ["Capital One"] },
  "chicago-pacific-founders": { scale: "Healthcare-focused private equity firm" },
  "context-integration": { scale: "Global transportation company (client of an IT consulting firm)" },
  "cvs-health": { scale: "Fortune 10 healthcare & retail company" },
  "dell-technologies": { scale: "Fortune 100 technology company", extraAliases: ["Dell"] },
  "eversource-energy": { scale: "Fortune 500 utility company", extraAliases: ["Eversource"] },
  "fannie-mae": { scale: "Government-sponsored mortgage finance enterprise", extraAliases: ["FNMA"] },
  "fast-retailing": { scale: "Global apparel retail group", extraAliases: ["Ariake"] },
  "first-data": { scale: "Fortune 500 payments technology company" },
  "intel-corporation": { scale: "Fortune 50 semiconductor company", extraAliases: ["Intel"] },
  jpmorganchase: {
    scale: "Global top-tier bank",
    extraAliases: ["JPMorgan Chase", "JP Morgan Chase", "JP Morgan Chase & Co", "JP Morgan", "Chase"],
  },
  "kemper-insurance": { scale: "National insurance carrier", extraAliases: ["Kemper"] },
  manugistics: { scale: "Enterprise supply-chain software company" },
  marriott: {
    scale: "Fortune 500 hospitality company",
    extraAliases: ["Marriott International", "Marriott.com"],
  },
  metrolinx: { scale: "Provincial government transit agency", extraAliases: ["GTA", "Presto"] },
  nielsen: { scale: "Global media & market research company", extraAliases: ["Nielsen Company"] },
  noaa: {
    scale: "US federal government agency",
    extraAliases: [
      "National Oceanic and Atmospheric Administration",
      "National Weather Service",
      "NWS",
      "NOAA/NWS",
    ],
  },
  "outerwall-redbox": { scale: "National retail kiosk company", extraAliases: ["Redbox", "Outerwall", "DeLorean"] },
  "royal-caribbean-cruises": {
    scale: "Fortune 500 cruise line",
    extraAliases: ["Royal Caribbean", "Celebrity Cruises", "Celebrity"],
  },
  "saudi-aramco": { scale: "Major petroleum refining company", extraAliases: ["Aramco", "Motiva"] },
  "skyauction-com": { scale: "Online travel auction startup", extraAliases: ["SkyAuction"] },
  "state-farm-insurance": { scale: "Fortune 50 insurance company", extraAliases: ["State Farm"] },
  "texas-health-and-human-services": { scale: "State government agency", extraAliases: ["Texas HHS", "HHS"] },
  tjx: { scale: "Fortune 100 retail company", extraAliases: ["TJ Maxx", "Marshalls"] },
  "us-forest-service": {
    scale: "US federal government agency",
    extraAliases: ["USFS", "Forest Service", "US Department of Agriculture", "USDA"],
  },
};
