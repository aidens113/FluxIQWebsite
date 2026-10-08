// The example website the hero's widgets automate: a fictional lead directory,
// matching the lead-generation example in the vision paper (v0.9, section on
// generated applications). Names, numbers, and counts are invented; the
// 555 exchange keeps every phone number fictional.

export type DirectoryRow = { initials: string; name: string; meta: string; phone: string };

export const DIRECTORY = {
  url: "ridgeline-leads.example/search",
  name: "Ridgeline Leads",
  initial: "R",
  nav: "Directory · Saved",
  placeholder: "Search trades",
  query: "roofing",
  button: "Search",
  chips: ["Alberta", "Calgary", "Edmonton"],
  /** The chip the examples click. */
  city: "Calgary",
  emptyTitle: "Find trade contractors",
  emptyBody: "4,200 businesses across Western Canada",
  countAll: "61 results",
  countCity: "24 results in Calgary",
  /** Before the Calgary filter: roofers from several cities. */
  rowsAll: [
    { initials: "SR", name: "Summit Roofing Co.", meta: "Calgary · Roofing", phone: "403-555-0142" },
    { initials: "ER", name: "Edmonton Roof Pros", meta: "Edmonton · Roofing", phone: "780-555-0131" },
    { initials: "RD", name: "Red Deer Roofing", meta: "Red Deer · Roofing", phone: "403-555-0119" },
    { initials: "PP", name: "Prairie Peak Roofers", meta: "Calgary · Roofing", phone: "403-555-0188" },
    { initials: "LR", name: "Lakeland Roofworks", meta: "Lethbridge · Roofing", phone: "403-555-0175" },
  ] satisfies DirectoryRow[],
  /** After it: Calgary only. */
  rowsCity: [
    { initials: "SR", name: "Summit Roofing Co.", meta: "Calgary · Roofing", phone: "403-555-0142" },
    { initials: "PP", name: "Prairie Peak Roofers", meta: "Calgary · Roofing", phone: "403-555-0188" },
    { initials: "BV", name: "Bow Valley Exteriors", meta: "Calgary · Roofing", phone: "403-555-0167" },
    { initials: "CR", name: "Chinook Roof & Gutter", meta: "Calgary · Roofing", phone: "825-555-0123" },
    { initials: "NS", name: "Northline Shingle", meta: "Calgary · Roofing", phone: "587-555-0110" },
  ] satisfies DirectoryRow[],
};
