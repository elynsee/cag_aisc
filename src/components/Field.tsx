/**
 * Field wrapper + Text Input + Currency Input — Enterprise
 * Specs: docs/inputs/text-input-field.md, docs/inputs/currency.md
 *   · Always a visible label — never placeholder-only.
 *   · Helper text where extra context helps; inline error below the field.
 *   · lg size on desktop, md on mobile (height switches at the 640px
 *     breakpoint in Field.css).
 *   · Currency: currency code always visible, "$" prefix, numeric only,
 *     2 decimal places with thousands separators.
 * Focus (SKILL.md §9.2): inputs use BOTH layers — 1px ring-brand border plus
 * a 4px ring-light outer glow — applied to the shell, never the raw input.
 */
import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import "./Field.css";

interface FieldProps {
  label: string;
  htmlFor?: string;
  helper?: ReactNode;
  error?: string;
  /** Renders the label for screen readers only, where the surrounding card
   *  already carries the visible heading. */
  hideLabel?: boolean;
  children: ReactNode;
}

export function Field({ label, htmlFor, helper, error, hideLabel, children }: FieldProps) {
  return (
    <div className="dls-field">
      <label
        className={`dls-field__label t-body-sm-bold${hideLabel ? " visually-hidden" : ""}`}
        htmlFor={htmlFor}
      >
        {label}
      </label>
      {children}
      {error ? (
        <span className="dls-field__error t-small" role="alert">
          {error}
        </span>
      ) : null}
      {helper && !error ? <span className="dls-field__helper t-small">{helper}</span> : null}
    </div>
  );
}

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  helper?: ReactNode;
  error?: string;
  hideLabel?: boolean;
}

export function TextInput({ label, helper, error, hideLabel, id, ...rest }: TextInputProps) {
  const generated = useId();
  const inputId = id ?? generated;

  return (
    <Field label={label} htmlFor={inputId} helper={helper} error={error} hideLabel={hideLabel}>
      <div className={`dls-field__shell${error ? " dls-field__shell--error" : ""}`}>
        <input
          id={inputId}
          className="dls-field__input t-body"
          aria-invalid={error ? true : undefined}
          {...rest}
        />
      </div>
    </Field>
  );
}

interface CurrencyInputProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  helper?: ReactNode;
  error?: string;
  id?: string;
  currency?: string;
  placeholder?: string;
}

/** Formats a raw numeric string to thousands separators + 2 decimals. */
export function formatCurrency(value: number): string {
  return value.toLocaleString("en-SG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function CurrencyInput({
  label,
  value,
  onValueChange,
  helper,
  error,
  id,
  currency = "SGD",
  placeholder = "0.00",
}: CurrencyInputProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const [focused, setFocused] = useState(false);

  /* Spec: numeric input only, one decimal point, letters and symbols other
     than "." are prevented at entry rather than rejected on submit. */
  const handleChange = (raw: string) => {
    const cleaned = raw.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    const normalised =
      parts.length > 1 ? `${parts[0]}.${parts.slice(1).join("").slice(0, 2)}` : parts[0];
    onValueChange(normalised);
  };

  /* Spec: defaults to 2 decimal places, auto-formats with separators. */
  const handleBlur = () => {
    setFocused(false);
    if (value === "") return;
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) onValueChange(parsed.toFixed(2));
  };

  const display = focused ? value : value === "" ? "" : formatCurrency(Number(value) || 0);

  return (
    <Field label={label} htmlFor={inputId} helper={helper} error={error}>
      <div className={`dls-field__shell${error ? " dls-field__shell--error" : ""}`}>
        <span className="dls-field__prefix t-body" aria-hidden>
          $
        </span>
        <input
          id={inputId}
          className="dls-field__input t-body"
          inputMode="decimal"
          autoComplete="off"
          value={display}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${inputId}-currency`}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          onChange={(e) => handleChange(e.target.value)}
        />
        {/* Spec: currency code stays visible at all times. */}
        <span id={`${inputId}-currency`} className="dls-field__suffix t-body-sm">
          {currency}
        </span>
      </div>
    </Field>
  );
}
