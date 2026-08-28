import type { ChipTone } from "./components/StatusChip";

/** Lifecycle of a staff claim. Chip tone/label per status live in claimStatus. */
export type ClaimStatus =
  | "draft"
  | "actionNeeded"
  | "query"
  | "submitted"
  | "approved"
  | "paid";

export interface Claim {
  id: string;
  reference: string;
  title: string;
  /** Supporting line: what is holding the claim up, or where it sits. */
  description: string;
  date: string;
  /** Amount in SGD. Rendered through formatCurrency — never pre-formatted. */
  amount: number;
  category: string;
  status: ClaimStatus;
  /** Next step shown in the expanded detail panel. */
  nextStep: string;
  /** Present when the claim is blocked on the claimant supplying something. */
  resolution?: {
    label: string;
    helper: string;
    placeholder: string;
  };
  /** Claims raised in this session, so the prototype can flag them. */
  isNew?: boolean;
}

/** Status Chip mapping. Sentence case, 1–2 words, never purple (spec). */
export const claimStatus: Record<ClaimStatus, { label: string; tone: ChipTone }> = {
  draft: { label: "Draft", tone: "neutral" },
  actionNeeded: { label: "Action needed", tone: "warning" },
  query: { label: "Query", tone: "warning" },
  submitted: { label: "Submitted", tone: "info" },
  approved: { label: "Approved", tone: "neutral" },
  paid: { label: "Paid", tone: "success" },
};

export type LegState = "reconciled" | "receiptsDue" | "notStarted";

export const legState: Record<LegState, { label: string; tone: ChipTone }> = {
  reconciled: { label: "Reconciled", tone: "success" },
  receiptsDue: { label: "Receipts due", tone: "warning" },
  notStarted: { label: "Not started", tone: "neutral" },
};

export interface TripLeg {
  id: string;
  name: string;
  meta: string;
  /** null until the leg has been claimed. */
  amount: number | null;
  state: LegState;
}

export interface Trip {
  id: string;
  reference: string;
  title: string;
  dates: string;
  approval: string;
  costCentre: string;
  approver: string;
  policyCap: string;
  budget: number;
  legs: TripLeg[];
}

/** File Upload states, per docs/selections/file-upload.md. */
export type UploadState = "uploading" | "success" | "error" | "cancelled";

export interface UploadFile {
  id: string;
  name: string;
  size: number;
  state: UploadState;
  progress: number;
  error?: string;
}
