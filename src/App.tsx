/**
 * CAG Claims — Landing / Start (Admin profile)
 *
 * COLUMN MAPPING
 *   Web Header .................. desktop col 1–12 | tablet col 1–6 | mobile col 1–4
 *   Start a claim (hero card) ... desktop col 3–10 | tablet col 1–6 | mobile col 1–4
 *   Ongoing claims .............. desktop col 3–10 | tablet col 1–6 | mobile col 1–4
 *   Pending trip claims ......... desktop col 3–10 | tablet col 1–6 | mobile col 1–4
 *   Page footer link ............ desktop col 3–10 | tablet col 1–6 | mobile col 1–4
 *
 * Desktop col 3–10 gives a symmetric two-column offset each side (usage guide
 * §2.2 — centring is column-span math, never a left margin). Grid placement is
 * structural CSS Grid throughout (§9.2), declared in styles/global.css.
 */
import { useMemo, useState } from "react";
import { WebHeader, type NavItem } from "./components/WebHeader";
import { FileUpload } from "./components/FileUpload";
import { ChatInput } from "./components/ChatInput";
import { ClaimList } from "./components/ClaimList";
import { TripCard } from "./components/TripCard";
import { Button } from "./components/Button";
import { Dropdown } from "./components/Dropdown";
import { CurrencyInput, TextInput, formatCurrency } from "./components/Field";
import { StatusChip } from "./components/StatusChip";
import {
  CLAIM_CATEGORIES,
  INITIAL_CLAIMS,
  INITIAL_TRIPS,
  NO_RECEIPT_CAP,
} from "./data";
import type { Claim, Trip, UploadFile } from "./types";
import "./App.css";

const NAV_ITEMS: NavItem[] = [
  { id: "claims", label: "My Claims" },
  { id: "approvals", label: "Approvals" },
  { id: "travel", label: "Travel" },
  { id: "policy", label: "Policy" },
];

const USER = { name: "Smith Menon", initials: "SM", firstName: "Smith" };

const TODAY = "28 Aug 2026";

/** Pulls an amount out of free text, e.g. "$18.40" or "18.40". */
function parseAmount(text: string): number | null {
  const match = text.match(/(?:\$|\bsgd\s*)?(\d[\d,]*(?:\.\d{1,2})?)/i);
  if (!match) return null;
  const value = Number(match[1].replace(/,/g, ""));
  return Number.isNaN(value) ? null : value;
}

/** Trims free text into a claim title of a sensible length. */
function toTitle(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length > 60 ? `${cleaned.slice(0, 57)}…` : cleaned;
}

let referenceSeed = 8842;
const nextReference = () => `CLM-${referenceSeed++}`;

export default function App() {
  const [view, setView] = useState("claims");
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);

  /* Declaration (no receipt) form. */
  const [declarationOpen, setDeclarationOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [declaredAmount, setDeclaredAmount] = useState("");
  const [declaredReason, setDeclaredReason] = useState("");
  const [declarationError, setDeclarationError] = useState<string | undefined>(undefined);

  /* Single polite live region — status messages are announced, not rendered as
     a toast, since no Toast/Feedback component is specified in the DLS repo. */
  const [announcement, setAnnouncement] = useState("");

  const addClaim = (claim: Claim) => {
    setClaims((current) => [claim, ...current]);
    setAnnouncement(`${claim.reference} created. ${claim.nextStep}`);
  };

  const handleUploadComplete = (file: UploadFile) => {
    addClaim({
      id: `c-${file.id}`,
      reference: nextReference(),
      title: file.name.replace(/\.[^.]+$/, ""),
      description: "Receipt read — check the details",
      date: TODAY,
      amount: 0,
      category: "Awaiting categorisation",
      status: "draft",
      nextStep:
        "We read the receipt. Confirm the amount, date and merchant, then send it to your approver.",
      resolution: {
        label: "Confirm the amount and merchant",
        helper: "Correct anything we misread before this goes to your approver.",
        placeholder: "42.60 at Crystal Jade, 28 Aug 2026",
      },
      isNew: true,
    });
  };

  const handleChatSubmit = (text: string) => {
    const amount = parseAmount(text) ?? 0;
    addClaim({
      id: `c-chat-${Date.now()}`,
      reference: nextReference(),
      title: toTitle(text),
      description: "Drafted from your description",
      date: TODAY,
      amount,
      category: "Awaiting categorisation",
      status: "draft",
      nextStep:
        "Answers are AI-generated. Check the amount and category, then send it to your approver.",
      resolution: {
        label: "Confirm the details",
        helper: "Your confirmation is recorded against the claim.",
        placeholder: "Amount and category are correct",
      },
      isNew: true,
    });
  };

  const submitDeclaration = () => {
    if (!category) {
      setDeclarationError("Select a category for this claim.");
      return;
    }
    const parsed = Number(declaredAmount);
    if (!declaredAmount || Number.isNaN(parsed) || parsed <= 0) {
      setDeclarationError("Enter an amount greater than zero.");
      return;
    }
    if (parsed > NO_RECEIPT_CAP) {
      setDeclarationError(
        `Claims without a receipt are capped at ${formatCurrency(
          NO_RECEIPT_CAP,
        )} SGD. Upload a receipt for anything above that.`,
      );
      return;
    }

    const selected = CLAIM_CATEGORIES.find((option) => option.value === category);
    addClaim({
      id: `c-dec-${Date.now()}`,
      reference: nextReference(),
      title: declaredReason.trim() || `${selected?.label ?? "Expense"} — declaration`,
      description: "Declaration — no receipt attached",
      date: TODAY,
      amount: parsed,
      category: selected?.label ?? "Awaiting categorisation",
      status: "actionNeeded",
      nextStep:
        "Declarations are reviewed by your approver in person, so approval takes longer than a receipted claim.",
      resolution: {
        label: "Why is there no receipt?",
        helper: "Your approver reads this before deciding.",
        placeholder: "Receipt was not issued by the driver.",
      },
      isNew: true,
    });

    setCategory(null);
    setDeclaredAmount("");
    setDeclaredReason("");
    setDeclarationError(undefined);
    setDeclarationOpen(false);
  };

  const resolveClaim = (claimId: string, response: string) => {
    setClaims((current) =>
      current.map((claim) =>
        claim.id === claimId
          ? {
              ...claim,
              status: "submitted",
              description: "Sent to your approver",
              nextStep: `Sent on ${TODAY}. Your approver replies within two working days.`,
              resolution: undefined,
            }
          : claim,
      ),
    );
    setAnnouncement(`Update sent: ${response}`);
  };

  const withdrawClaim = (claimId: string) => {
    const claim = claims.find((item) => item.id === claimId);
    setClaims((current) => current.filter((item) => item.id !== claimId));
    setAnnouncement(`${claim?.reference ?? "Claim"} withdrawn.`);
  };

  const addTripExpense = (tripId: string, legId: string, amount: number) => {
    setTrips((current) =>
      current.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              legs: trip.legs.map((leg) =>
                leg.id === legId
                  ? { ...leg, amount: (leg.amount ?? 0) + amount, state: "reconciled" as const }
                  : leg,
              ),
            }
          : trip,
      ),
    );
    setAnnouncement(`${formatCurrency(amount)} SGD added to the trip and reconciled.`);
  };

  const inProgress = useMemo(
    () => claims.filter((claim) => claim.status !== "paid"),
    [claims],
  );
  const visibleClaims = showCompleted ? claims : inProgress;
  const openTrips = trips.filter((trip) => trip.legs.some((leg) => leg.state !== "reconciled"));

  if (view !== "claims") {
    const label = NAV_ITEMS.find((item) => item.id === view)?.label ?? "This module";
    return (
      <>
        <WebHeader
          navItems={NAV_ITEMS}
          activeId={view}
          onNavigate={setView}
          userName={USER.name}
          userInitials={USER.initials}
          onSignOut={() => setView("claims")}
          onOpenSettings={() => setView("claims")}
        />
        {/* Placeholder module — desktop col 3–10 | tablet 1–6 | mobile 1–4 */}
        <main id="main" className="dls-grid dls-page">
          <section className="dls-col-main dls-card dls-placeholder">
            <h1 className="t-h5-admin dls-placeholder__title">{label}</h1>
            <p className="t-body dls-placeholder__body">
              {label} is outside the scope of this prototype. Only My Claims is built out.
            </p>
            <Button variant="secondary" width="fit" onClick={() => setView("claims")}>
              Back To My Claims
            </Button>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      {/* Web Header — col 1–12 / 1–6 / 1–4, sticky */}
      <WebHeader
        navItems={NAV_ITEMS}
        activeId={view}
        onNavigate={setView}
        userName={USER.name}
        userInitials={USER.initials}
        onSignOut={() => setAnnouncement("Signed out. This prototype keeps you on the page.")}
        onOpenSettings={() =>
          setAnnouncement("User settings are outside the scope of this prototype.")
        }
      />

      <main id="main" className="dls-grid dls-page">
        {/* ===== Start a claim — desktop col 3–10 | tablet 1–6 | mobile 1–4 ===== */}
        <section className="dls-col-main dls-card" aria-labelledby="start-a-claim">
          <h1 id="start-a-claim" className="t-h5-admin dls-hero__greeting">
            Good morning, {USER.firstName}.
          </h1>
          <p className="t-body dls-hero__sub">
            Drop a receipt and we will fill in the rest. Payroll cut-off is Friday, 6.00pm.
          </p>

          <span className="dls-hero__field-label t-body-sm-bold" id="receipt-label">
            Receipt
          </span>
          <div role="group" aria-labelledby="receipt-label">
            <FileUpload
              files={uploads}
              onFilesChange={(updater) => setUploads((current) => updater(current))}
              onUploadComplete={handleUploadComplete}
              onClaimWithoutReceipt={() => setDeclarationOpen((prev) => !prev)}
            />
          </div>
          <span className="dls-hero__helper t-small">
            JPG, PNG or PDF, up to 10MB per file. No receipt? You can file a declaration instead —
            approval takes longer and a {formatCurrency(NO_RECEIPT_CAP)} SGD cap applies.
          </span>

          {declarationOpen ? (
            <div className="dls-declaration">
              <div className="dls-declaration__head">
                <p className="t-body-sm-bold dls-declaration__title">Claim without a receipt</p>
                <StatusChip label="Cap applies" tone="warning" />
              </div>
              <div className="dls-declaration__fields">
                <Dropdown
                  label="Category"
                  options={CLAIM_CATEGORIES}
                  value={category}
                  placeholder="Select a category"
                  onChange={(value) => {
                    setCategory(value);
                    setDeclarationError(undefined);
                  }}
                />
                <CurrencyInput
                  label="Amount"
                  value={declaredAmount}
                  onValueChange={(value) => {
                    setDeclaredAmount(value);
                    setDeclarationError(undefined);
                  }}
                  helper={`Capped at ${formatCurrency(NO_RECEIPT_CAP)} SGD without a receipt.`}
                  error={declarationError}
                />
              </div>
              <TextInput
                label="What was this for?"
                placeholder="Taxi from Jewel to Changi HQ"
                helper="One line is enough. Your approver sees this first."
                value={declaredReason}
                onChange={(event) => setDeclaredReason(event.target.value)}
              />
              <div className="dls-declaration__actions">
                <Button variant="secondary" width="fit" onClick={submitDeclaration}>
                  File Declaration
                </Button>
                <Button
                  variant="tertiary"
                  width="fit"
                  onClick={() => {
                    setDeclarationOpen(false);
                    setDeclarationError(undefined);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}

          <div className="dls-divider">
            <span className="t-small">or</span>
          </div>

          <ChatInput
            onSubmit={handleChatSubmit}
            onAttach={() => document.getElementById("receipt-upload")?.click()}
          />
        </section>

        {/* ===== Ongoing claims — desktop col 3–10 | tablet 1–6 | mobile 1–4 ===== */}
        <section className="dls-col-main" aria-labelledby="ongoing-claims">
          <div className="dls-section-head">
            <h2 id="ongoing-claims" className="t-h6 dls-section-head__title">
              Ongoing claims
            </h2>
            <span className="dls-section-head__spacer" />
            <span className="t-body-sm dls-section-head__count">
              {inProgress.length} in progress · amounts in SGD
            </span>
          </div>
          <ClaimList claims={visibleClaims} onResolve={resolveClaim} onWithdraw={withdrawClaim} />
        </section>

        {/* ===== Pending trip claims — desktop col 3–10 | tablet 1–6 | mobile 1–4 ===== */}
        <section className="dls-col-main" aria-labelledby="pending-trips">
          <div className="dls-section-head">
            <h2 id="pending-trips" className="t-h6 dls-section-head__title">
              Pending trip claims
            </h2>
            <span className="dls-section-head__spacer" />
            <span className="t-body-sm dls-section-head__count">
              {openTrips.length === 1 ? "1 trip open" : `${openTrips.length} trips open`}
            </span>
          </div>

          {trips.length === 0 ? (
            <div className="dls-empty">
              <p className="t-body-sm-bold dls-empty__title">No open trips</p>
              <p className="t-body-sm dls-empty__body">
                Trip expenses appear here once your travel request is approved.
              </p>
            </div>
          ) : (
            <div className="dls-trips">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onAddExpense={addTripExpense} />
              ))}
            </div>
          )}
        </section>

        {/* ===== Footer link — desktop col 3–10 | tablet 1–6 | mobile 1–4 ===== */}
        <div className="dls-col-main dls-page__foot">
          <Button
            variant="link"
            width="fit"
            aria-expanded={showCompleted}
            onClick={() => setShowCompleted((prev) => !prev)}
          >
            {showCompleted ? "Hide Completed Claims" : "View All Claims And Trips"}
          </Button>
        </div>
      </main>

      <p className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </p>
    </>
  );
}
