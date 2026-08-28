/**
 * Status Chip — Enterprise
 * Spec: docs/actions-interactions/status-chips.md
 *   · Communicates system/service status only — never a category, attribute
 *     or filter.
 *   · Rectangular in B2B/admin interfaces (pill is B2C only) → radius-xs.
 *   · Never purple: that colour is reserved for interactive components.
 *   · Static — no hover, focus or click affordance.
 *   · Sentence case, 1–2 words.
 */
import type { ReactNode } from "react";
import "./StatusChip.css";

export type ChipTone = "success" | "warning" | "error" | "neutral" | "info";

interface StatusChipProps {
  label: string;
  tone: ChipTone;
  /** Optional and must reinforce the status meaning, per spec. */
  icon?: ReactNode;
}

export function StatusChip({ label, tone, icon }: StatusChipProps) {
  return (
    <span className={`dls-chip dls-chip--${tone} t-tag`}>
      {icon ? <span className="dls-chip__icon">{icon}</span> : null}
      {label}
    </span>
  );
}
