/**
 * Icon set — inline SVG, currentColor stroke.
 *
 * Runway DLS usage guide §3: no emoji anywhere in generated UI. Status,
 * action and emphasis are carried by icons from this set or by plain text
 * labels plus semantic colour tokens.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
});

export const UploadIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </svg>
);

export const PlusIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={2} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const ArrowUpIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={2} {...p}>
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </svg>
);

export const ChevronRightIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={2} {...p}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const ChevronDownIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={2} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const HelpIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3 2.45V14" />
    <path d="M12 17h.01" />
  </svg>
);

export const LogoutIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

export const SettingsIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.2.5.66.86 1.2.99H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);

export const MenuIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={2} {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const CloseIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={2} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const FileIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
    <path d="M14 3v5h5" />
  </svg>
);

export const CheckIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={2} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const AlertIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
  </svg>
);

export const RetryIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M3 12a9 9 0 1 0 2.64-6.36L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export const TrashIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M3 6h18" />
    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
  </svg>
);


/** CAG brand mark. Decorative — the accessible name comes from the wordmark. */
export const BrandMark = ({ size = 24, ...p }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    focusable="false"
    {...p}
  >
    <circle cx="12" cy="12" r="11" fill="var(--color-purple-600)" />
    <path
      d="M6 14.5c3.5 1.8 8.5 1.4 12-1.2"
      stroke="var(--color-grey-25)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M7.5 10.2c3-2.4 7.2-2.6 10.2-.6"
      stroke="var(--color-purple-300)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);
