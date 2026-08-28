/**
 * Button — Enterprise
 * Spec: docs/actions-interactions/buttons.md
 *   · Title Case labels, max 4 words, actionable verb.
 *   · One Primary button per screen.
 *   · Minimum desktop width 240px, or `fit` where the button adapts to text
 *     (spec: width "may either fill the page container or adapt to the text
 *     length", the choice is the designer's).
 *   · Loading state blocks duplicate submission; disabled blocks interaction.
 * Radius: radius-sm (SKILL.md §10, Admin profile).
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

type Variant = "primary" | "secondary" | "tertiary" | "link";
type Width = "min" | "fit" | "full";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  width?: Width;
  loading?: boolean;
  iconLeft?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  width = "min",
  loading = false,
  iconLeft,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = [
    "dls-btn",
    `dls-btn--${variant}`,
    `dls-btn--w-${width}`,
    "t-body-sm-bold",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      /* Spec: button stays visible but non-interactive while loading, so no
         duplicate submissions can be triggered. */
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="dls-btn__spinner" aria-hidden /> : iconLeft}
      <span>{children}</span>
    </button>
  );
}
