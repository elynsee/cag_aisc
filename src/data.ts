/**
 * Seed data for the prototype. Amounts are numeric SGD values — formatting is
 * the currency component's job (docs/inputs/currency.md).
 */
import type { Claim, Trip } from "./types";

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: "c-8836",
    reference: "CLM-8836",
    title: "Team lunch — 6 attendees",
    description: "Attendee names missing",
    date: "25 Aug 2026",
    amount: 212,
    category: "Staff entertainment",
    status: "actionNeeded",
    nextStep: "Add the attendee names to send this to your approver.",
    resolution: {
      label: "Attendee names",
      helper: "Separate each name with a comma. All six attendees are required.",
      placeholder: "L. Tan, R. Iyer, M. Chua",
    },
  },
  {
    id: "c-8790",
    reference: "CLM-8790",
    title: "Safety certification renewal",
    description: "Query raised by L. Tan",
    date: "15 Aug 2026",
    amount: 380,
    category: "Training and certification",
    status: "query",
    nextStep: "Your approver asked which cost centre this should be charged to.",
    resolution: {
      label: "Reply to approver",
      helper: "Your reply is added to the claim history and sent to L. Tan.",
      placeholder: "Charge to cost centre 4402 — airside operations.",
    },
  },
  {
    id: "c-8829",
    reference: "CLM-8829",
    title: "Mobile data top-up",
    description: "With Finance for payment",
    date: "22 Aug 2026",
    amount: 45,
    category: "Communications",
    status: "approved",
    nextStep: "Finance pays approved claims in the next payroll run.",
  },
  {
    id: "c-8841",
    reference: "CLM-8841",
    title: "Grab — Jewel to Changi HQ",
    description: "Paid with August payroll",
    date: "26 Aug 2026",
    amount: 18.4,
    category: "Local transport",
    status: "paid",
    nextStep: "No action needed. Paid on 26 Aug 2026.",
  },
  {
    id: "c-8802",
    reference: "CLM-8802",
    title: "Stationery — T3 office",
    description: "Paid with August payroll",
    date: "18 Aug 2026",
    amount: 12.9,
    category: "Office supplies",
    status: "paid",
    nextStep: "No action needed. Paid on 18 Aug 2026.",
  },
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: "t-0418",
    reference: "TRV-0418",
    title: "Zurich — ICAO working group",
    dates: "14–19 Sep 2026",
    approval: "Approved under DOA Tier 3",
    costCentre: "4402",
    approver: "L. Tan, Head of Airside Operations",
    policyCap: "Hotel capped at 420.00 per night for Zurich",
    budget: 6600,
    legs: [
      {
        id: "l-flight",
        name: "Flight — SQ346 SIN/ZRH",
        meta: "Booked via CTS",
        amount: 2180,
        state: "reconciled",
      },
      {
        id: "l-hotel",
        name: "Hotel — 4 nights",
        meta: "Within city cap",
        amount: 1540,
        state: "reconciled",
      },
      {
        id: "l-subsistence",
        name: "Subsistence — 3 days",
        meta: "IRAS acceptable rate",
        amount: 400,
        state: "receiptsDue",
      },
      {
        id: "l-transfers",
        name: "Airport transfers",
        meta: "Not yet claimed",
        amount: null,
        state: "notStarted",
      },
    ],
  },
];

/** Categories offered when a claim is raised without a receipt. */
export const CLAIM_CATEGORIES = [
  { value: "local-transport", label: "Local transport", meta: "Taxi, rail, ride-hailing" },
  { value: "meals", label: "Meals and subsistence", meta: "Within IRAS acceptable rates" },
  { value: "office-supplies", label: "Office supplies", meta: "Stationery, consumables" },
  { value: "communications", label: "Communications", meta: "Mobile data, roaming" },
  { value: "training", label: "Training and certification", meta: "Courses, renewals" },
];

export const ACCEPTED_FILE_TYPES = [".jpg", ".jpeg", ".png", ".pdf"];
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
/** Declarations without a receipt are capped by policy. */
export const NO_RECEIPT_CAP = 50;
