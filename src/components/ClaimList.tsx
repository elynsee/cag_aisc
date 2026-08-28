/**
 * Ongoing claims list.
 *
 * Each row expands in place to a detail panel. Where a claim is blocked on the
 * claimant, the panel carries the resolution field that unblocks it — so the
 * "Action needed" chip always has somewhere to lead.
 *
 * Status Chips are static labels (spec) — the row, not the chip, is the
 * interactive element.
 * Grid: rows sit inside col-main (desktop 3–10 / tablet 1–6 / mobile 1–4).
 */
import { useState } from "react";
import { ChevronRightIcon } from "./Icon";
import { StatusChip } from "./StatusChip";
import { Button } from "./Button";
import { TextInput, formatCurrency } from "./Field";
import { claimStatus, type Claim } from "../types";
import "./ClaimList.css";

interface ClaimListProps {
  claims: Claim[];
  onResolve: (claimId: string, response: string) => void;
  onWithdraw: (claimId: string) => void;
}

export function ClaimList({ claims, onResolve, onWithdraw }: ClaimListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});

  if (claims.length === 0) {
    return (
      <div className="dls-empty">
        <p className="t-body-sm-bold dls-empty__title">No claims in progress</p>
        <p className="t-body-sm dls-empty__body">
          Upload a receipt or describe a claim above to get started.
        </p>
      </div>
    );
  }

  return (
    <ul className="dls-claims">
      {claims.map((claim) => {
        const status = claimStatus[claim.status];
        const isExpanded = expandedId === claim.id;
        /* A claim can only be withdrawn while the claimant still owns it —
           once Finance has approved or paid it, withdrawal is not available. */
        const canWithdraw = claim.status !== "paid" && claim.status !== "approved";
        const response = responses[claim.id] ?? "";
        const panelId = `claim-panel-${claim.id}`;

        return (
          <li key={claim.id} className="dls-claims__row">
            <button
              type="button"
              className={`dls-claims__item${isExpanded ? " dls-claims__item--expanded" : ""}`}
              aria-expanded={isExpanded}
              aria-controls={panelId}
              onClick={() => setExpandedId(isExpanded ? null : claim.id)}
            >
              <span className="t-body-sm dls-claims__ref">{claim.reference}</span>

              <span className="dls-claims__body">
                <span className="t-body-bold dls-claims__title">
                  {claim.title}
                  {claim.isNew ? (
                    <span className="t-small dls-claims__new">New</span>
                  ) : null}
                </span>
                <span className="t-small dls-claims__desc">{claim.description}</span>
              </span>

              <span className="t-body-sm dls-claims__date">{claim.date}</span>
              <span className="t-body-bold dls-claims__amount">
                {formatCurrency(claim.amount)}
              </span>
              <span className="dls-claims__status">
                <StatusChip label={status.label} tone={status.tone} />
              </span>
              <span className="dls-claims__chevron" aria-hidden>
                <ChevronRightIcon
                  className={isExpanded ? "dls-claims__chevron-icon--open" : undefined}
                />
              </span>
            </button>

            {isExpanded ? (
              <div className="dls-claims__panel" id={panelId}>
                <dl className="dls-claims__detail">
                  <div className="dls-claims__detail-pair">
                    <dt className="t-small dls-claims__detail-term">Category</dt>
                    <dd className="t-body-sm dls-claims__detail-value">{claim.category}</dd>
                  </div>
                  <div className="dls-claims__detail-pair">
                    <dt className="t-small dls-claims__detail-term">Date of expense</dt>
                    <dd className="t-body-sm dls-claims__detail-value">{claim.date}</dd>
                  </div>
                  <div className="dls-claims__detail-pair">
                    <dt className="t-small dls-claims__detail-term">Amount</dt>
                    <dd className="t-body-sm dls-claims__detail-value">
                      {formatCurrency(claim.amount)} SGD
                    </dd>
                  </div>
                  <div className="dls-claims__detail-pair">
                    <dt className="t-small dls-claims__detail-term">Reference</dt>
                    <dd className="t-body-sm dls-claims__detail-value">{claim.reference}</dd>
                  </div>
                </dl>

                <p className="t-body-sm dls-claims__next">{claim.nextStep}</p>

                {claim.resolution ? (
                  <div className="dls-claims__resolve">
                    <TextInput
                      label={claim.resolution.label}
                      helper={claim.resolution.helper}
                      placeholder={claim.resolution.placeholder}
                      value={response}
                      onChange={(event) =>
                        setResponses((prev) => ({ ...prev, [claim.id]: event.target.value }))
                      }
                    />
                    <div className="dls-claims__resolve-actions">
                      <Button
                        variant="secondary"
                        width="fit"
                        disabled={response.trim().length === 0}
                        onClick={() => {
                          onResolve(claim.id, response.trim());
                          setResponses((prev) => ({ ...prev, [claim.id]: "" }));
                          setExpandedId(null);
                        }}
                      >
                        Send Update
                      </Button>
                      {canWithdraw ? (
                        <Button
                          variant="tertiary"
                          width="fit"
                          onClick={() => onWithdraw(claim.id)}
                        >
                          Withdraw Claim
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ) : canWithdraw ? (
                  <div className="dls-claims__resolve-actions">
                    <Button variant="tertiary" width="fit" onClick={() => onWithdraw(claim.id)}>
                      Withdraw Claim
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
