/**
 * Dropdown Input + Dropdown Option — Enterprise
 * Spec: docs/inputs/dropdown-input.md
 *   · Field is non-editable; typing never changes the value.
 *   · Placeholder shows until a selection is made; selection replaces it.
 *   · Chevron indicates open/close state.
 *   · Closes on select, Esc, or a click outside.
 *   · Selected option stays highlighted when the menu is reopened.
 */
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDownIcon } from "./Icon";
import { Field } from "./Field";
import "./Dropdown.css";

export interface DropdownOption {
  value: string;
  label: string;
  /** Optional supporting line rendered under the label in the menu. */
  meta?: string;
  disabled?: boolean;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
}

export function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  helper,
  error,
  disabled,
}: DropdownProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <Field label={label} htmlFor={id} helper={helper} error={error}>
      <div className="dls-dropdown" ref={rootRef}>
        <button
          id={id}
          type="button"
          className={`dls-field__shell dls-dropdown__control${
            error ? " dls-field__shell--error" : ""
          }`}
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span
            className={`dls-dropdown__value t-body${
              selected ? "" : " dls-dropdown__value--placeholder"
            }`}
          >
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDownIcon
            className={`dls-dropdown__chevron${open ? " dls-dropdown__chevron--open" : ""}`}
          />
        </button>

        {open ? (
          <ul className="dls-dropdown__menu" role="listbox" aria-labelledby={id}>
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={`dls-dropdown__option${
                    option.value === value ? " dls-dropdown__option--selected" : ""
                  }`}
                  disabled={option.disabled}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <span className="t-body-sm">{option.label}</span>
                  {option.meta ? (
                    <span className="dls-dropdown__option-meta t-small">{option.meta}</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Field>
  );
}
