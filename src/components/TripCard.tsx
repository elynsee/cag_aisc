/**
 * Pending trip claim card.
 *
 * "Add Trip Expense" opens an inline form scoped to the trip: pick the leg
 * (Dropdown Input), enter the amount (Currency Input), save. Saving updates
 * the leg, the claimed total and the budget bar, so the card demonstrates the
 * whole reconcile loop rather than linking away.
 *
 * The budget bar uses Gray blue — an extended-palette category colour, never
 * an interactive one.
 * Grid: card sits inside col-main (desktop 3–10 / tablet 1–6 / mobile 1–4).
 */
import { useMemo, useState } from "react";
import { Button } from "./Button";
import { StatusChip } from "./StatusChip";
import { Dropdown } from "./Dropdown";
import { CurrencyInput, formatCurrency } from "./Field";
import { legState, type Trip } from "../types";
import "./TripCard.css";

interface TripCardProps {
  trip: Trip;
  onAddExpense: (tripId: string, legId: string, amount: number) => void;
}

export function TripCard({ trip, onAddExpense }: TripCardProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [legId, setLegId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const claimed = useMemo(
    () => trip.legs.reduce((total, leg) => total + (leg.amount ?? 0), 0),
    [trip.legs],
  );
  const percentage = Math.min(100, Math.round((claimed / trip.budget) * 100));
  const outstanding = trip.legs.filter((leg) => leg.state !== "reconciled").length;
  const remaining = trip.budget - claimed;

  const legOptions = trip.legs.map((leg) => ({
    value: leg.id,
    label: leg.name,
    meta: leg.amount === null ? "Not yet claimed" : `${formatCurrency(leg.amount)} claimed`,
  }));

  const save = () => {
    if (!legId) {
      setError("Select which leg this expense belongs to.");
      return;
    }
    const parsed = Number(amount);
    if (!amount || Number.isNaN(parsed) || parsed <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (parsed > remaining) {
      setError(
        `That exceeds the remaining budget of ${formatCurrency(remaining)} SGD for this trip.`,
      );
      return;
    }
    onAddExpense(trip.id, legId, parsed);
    setLegId(null);
    setAmount("");
    setError(undefined);
    setFormOpen(false);
  };

  return (
    <article className="dls-trip">
      <div className="dls-trip__head">
        <div className="dls-trip__head-main">
          <div className="dls-trip__eyebrow">
            <span className="t-body-sm dls-trip__ref">{trip.reference}</span>
            {outstanding > 0 ? <StatusChip label="Outstanding" tone="info" /> : null}
          </div>
          <h3 className="t-body-bold dls-trip__title">{trip.title}</h3>
          <p className="t-small dls-trip__meta">
            {trip.dates} · {trip.approval} · Cost centre {trip.costCentre}
          </p>
        </div>

        <div className="dls-trip__amount">
          <span className="t-h6 dls-trip__amount-value">{formatCurrency(claimed)}</span>
          <span className="t-small dls-trip__amount-label">
            of {formatCurrency(trip.budget)} SGD budget
          </span>
        </div>
      </div>

      <div className="dls-trip__budget">
        <div className="dls-trip__budget-head">
          <span className="t-small">Claimed against approved budget</span>
          <span className="t-small">{percentage}%</span>
        </div>
        <div
          className="dls-trip__budget-bar"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${trip.title} budget used`}
        >
          <span className="dls-trip__budget-fill" style={{ width: `${percentage}%` }} />
        </div>
        <p className="t-small dls-trip__budget-note">
          {outstanding === 0
            ? "All legs reconciled. Nothing outstanding on this trip."
            : `${outstanding} of ${trip.legs.length} legs outstanding · ${formatCurrency(
                remaining,
              )} SGD remaining`}
        </p>
      </div>

      <ul className="dls-trip__legs">
        {trip.legs.map((leg) => {
          const state = legState[leg.state];
          return (
            <li key={leg.id} className="dls-trip__leg">
              <span className="dls-trip__leg-body">
                <span className="t-body-sm dls-trip__leg-name">{leg.name}</span>
                <span className="t-small dls-trip__leg-meta">{leg.meta}</span>
              </span>
              <span>
                <StatusChip label={state.label} tone={state.tone} />
              </span>
              <span className="t-body-sm dls-trip__leg-amount">
                {leg.amount === null ? "—" : formatCurrency(leg.amount)}
              </span>
            </li>
          );
        })}
      </ul>

      {detailOpen ? (
        <dl className="dls-trip__detail">
          <div className="dls-trip__detail-pair">
            <dt className="t-small dls-trip__detail-term">Approver</dt>
            <dd className="t-body-sm dls-trip__detail-value">{trip.approver}</dd>
          </div>
          <div className="dls-trip__detail-pair">
            <dt className="t-small dls-trip__detail-term">Policy cap</dt>
            <dd className="t-body-sm dls-trip__detail-value">{trip.policyCap}</dd>
          </div>
          <div className="dls-trip__detail-pair">
            <dt className="t-small dls-trip__detail-term">Travel dates</dt>
            <dd className="t-body-sm dls-trip__detail-value">{trip.dates}</dd>
          </div>
          <div className="dls-trip__detail-pair">
            <dt className="t-small dls-trip__detail-term">Approval route</dt>
            <dd className="t-body-sm dls-trip__detail-value">{trip.approval}</dd>
          </div>
        </dl>
      ) : null}

      {formOpen ? (
        <div className="dls-trip__form">
          <p className="t-body-sm-bold dls-trip__form-title">Add an expense to this trip</p>
          <div className="dls-trip__form-fields">
            <Dropdown
              label="Trip leg"
              options={legOptions}
              value={legId}
              placeholder="Select a leg"
              onChange={(value) => {
                setLegId(value);
                setError(undefined);
              }}
            />
            <CurrencyInput
              label="Amount"
              value={amount}
              onValueChange={(value) => {
                setAmount(value);
                setError(undefined);
              }}
              helper="Enter the amount in SGD. Values auto-format to two decimals."
              error={error}
            />
          </div>
          <div className="dls-trip__form-actions">
            <Button variant="secondary" width="fit" onClick={save}>
              Save Expense
            </Button>
            <Button
              variant="tertiary"
              width="fit"
              onClick={() => {
                setFormOpen(false);
                setError(undefined);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <div className="dls-trip__foot">
        <Button
          variant="secondary"
          width="fit"
          aria-expanded={formOpen}
          onClick={() => setFormOpen((prev) => !prev)}
        >
          Add Trip Expense
        </Button>
        <Button
          variant="tertiary"
          width="fit"
          aria-expanded={detailOpen}
          onClick={() => setDetailOpen((prev) => !prev)}
        >
          {detailOpen ? "Hide Trip Details" : "View Trip Details"}
        </Button>
      </div>
    </article>
  );
}
