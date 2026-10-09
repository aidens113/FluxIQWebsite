import type { HowJob } from "./how-it-works";

// The three example jobs How it works rotates through, each a sentence and the
// Flow it became. Sources and the cost model are in content/how-it-works.ts.
// AI this month is runs per month x the share of runs checked x about $0.01 a
// judged run. Every name, count, time, price, and address here is invented.
export const HOW_JOBS: readonly HowJob[] = [
  {
    ask: "Every morning, add new roofers in Calgary to my sheet.",
    name: "Calgary roofer leads",
    schedule: "Every day · 7:00",
    steps: ["Open the directory", "Search “roofing”", "Filter to Calgary", "Add new rows"],
    next: "Tomorrow, 7:00",
    checks: "Trusted · spot-checked 1 in 50 runs",
    spend: "$0.01",
    cadence: "daily",
    time: "7:00",
    base: 212,
    results: [
      { mark: "+", text: "3 new roofers added to your sheet", tone: "ok" },
      { mark: "+", text: "1 new roofer added to your sheet", tone: "ok" },
      { mark: "+", text: "4 new roofers added to your sheet", tone: "ok" },
      { mark: "+", text: "2 new roofers added to your sheet", tone: "ok" },
      { mark: "·", text: "No new roofers today; sheet unchanged", tone: "neutral" },
      { mark: "+", text: "5 new roofers added to your sheet", tone: "ok" },
    ],
  },
  {
    ask: "Tell me when this listing drops under $400k.",
    name: "Listing price watch",
    schedule: "Every hour",
    steps: ["Open the listing", "Read the price", "Compare with $400k", "Email you if under"],
    next: "On the hour",
    checks: "Trusted · spot-checked 1 in 50 runs",
    spend: "$0.14",
    cadence: "hourly",
    time: "",
    base: 1806,
    // One listing per group of three, so a price never climbs back over
    // $400k on screen: once it drops and the alert goes out, a new
    // listing fades in.
    group: 3,
    results: [
      { mark: "·", text: "14 Elm Ave: $412,000, still above $400k", tone: "neutral" },
      { mark: "·", text: "14 Elm Ave: $407,500, still above $400k", tone: "neutral" },
      { mark: "!", text: "14 Elm Ave: $398,500. Alert sent to you", tone: "attention", status: "Alert sent" },
      { mark: "·", text: "302 Bow Cres: $431,000, still above $400k", tone: "neutral" },
      { mark: "·", text: "302 Bow Cres: $418,000, still above $400k", tone: "neutral" },
      { mark: "!", text: "302 Bow Cres: $396,000. Alert sent to you", tone: "attention", status: "Alert sent" },
      { mark: "·", text: "9 Ridge Rd: $415,000, still above $400k", tone: "neutral" },
      { mark: "·", text: "9 Ridge Rd: $409,900, still above $400k", tone: "neutral" },
      { mark: "!", text: "9 Ridge Rd: $389,900. Alert sent to you", tone: "attention", status: "Alert sent" },
    ],
    allowed: "✓ Alert email allowed by you",
  },
  {
    ask: "Every Friday, save my invoices to a folder.",
    name: "Friday invoices",
    schedule: "Fridays · 17:00",
    steps: ["Open your billing page", "Download new invoices", "Save to a dated folder"],
    next: "Next Friday, 17:00",
    checks: "Earning trust · checked 1 in 5 runs",
    spend: "$0.01",
    cadence: "weekly",
    time: "17:00",
    base: 41,
    results: [
      { mark: "✓", text: "6 invoices saved to your Invoices folder", tone: "ok" },
      { mark: "✓", text: "4 invoices saved to your Invoices folder", tone: "ok" },
      { mark: "✓", text: "7 invoices saved to your Invoices folder", tone: "ok" },
      { mark: "✓", text: "5 invoices saved to your Invoices folder", tone: "ok" },
    ],
  },
];
