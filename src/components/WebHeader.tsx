/**
 * Web Header — Admin Header
 * Spec: docs/page-navigations/web-header.md
 *   · Primary site-wide navigation plus key actions.
 *   · User account dropdown sits on the far right and holds User Settings and
 *     Logout (System Switch optional — omitted, this prototype is one system).
 *   · Dropdown closes on outside click or on selecting an option.
 *   · Username truncates when long.
 *   · Sticky at the top, as is typical for admin tools.
 *   · On small screens navigation moves into a hamburger menu; the account
 *     dropdown stays reachable at every breakpoint.
 * Grid: col 1–12 desktop / col 1–6 tablet / col 1–4 mobile (full bleed).
 */
import { useEffect, useRef, useState } from "react";
import { BrandMark, ChevronDownIcon, HelpIcon, LogoutIcon, MenuIcon, SettingsIcon } from "./Icon";
import "./WebHeader.css";

export interface NavItem {
  id: string;
  label: string;
}

interface WebHeaderProps {
  navItems: NavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  userName: string;
  userInitials: string;
  onSignOut: () => void;
  onOpenSettings: () => void;
}

export function WebHeader({
  navItems,
  activeId,
  onNavigate,
  userName,
  userInitials,
  onSignOut,
  onOpenSettings,
}: WebHeaderProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);

  const go = (id: string) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <header className="dls-header">
      <div className="dls-header__inner">
        <a className="dls-header__brand" href="#main">
          <BrandMark className="dls-header__brand-mark" />
          <span className="dls-header__brand-name">
            <span className="t-body-bold dls-header__brand-primary">CHANGI</span>
            <span className="t-xxsmall dls-header__brand-secondary">Airport Group</span>
          </span>
        </a>

        <nav className="dls-header__nav" aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`dls-header__nav-link t-body-sm${
                item.id === activeId ? " dls-header__nav-link--active" : ""
              }`}
              aria-current={item.id === activeId ? "page" : undefined}
              onClick={() => go(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="dls-header__actions">
          <button
            type="button"
            className="dls-header__icon-btn dls-header__menu-toggle"
            aria-label="Main menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <MenuIcon />
          </button>

          <button type="button" className="dls-header__icon-btn" aria-label="Help">
            <HelpIcon />
          </button>

          <div className="dls-header__account" ref={accountRef}>
            <button
              type="button"
              className="dls-header__account-trigger"
              aria-haspopup="menu"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((prev) => !prev)}
            >
              <span className="dls-header__avatar t-tag" aria-hidden>
                {userInitials}
              </span>
              <span className="dls-header__account-name t-body-sm">{userName}</span>
              <ChevronDownIcon
                className={`dls-header__account-chevron${
                  accountOpen ? " dls-header__account-chevron--open" : ""
                }`}
              />
            </button>

            {accountOpen ? (
              <div className="dls-header__menu" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className="dls-header__menu-item t-body-sm"
                  onClick={() => {
                    onOpenSettings();
                    setAccountOpen(false);
                  }}
                >
                  <SettingsIcon />
                  User Settings
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="dls-header__menu-item t-body-sm"
                  onClick={() => {
                    onSignOut();
                    setAccountOpen(false);
                  }}
                >
                  <LogoutIcon />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Small-screen navigation, per the spec's responsiveness rule. */}
      {menuOpen ? (
        <nav className="dls-header__drawer" aria-label="Primary, compact">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`dls-header__drawer-link t-body-sm${
                item.id === activeId ? " dls-header__drawer-link--active" : ""
              }`}
              aria-current={item.id === activeId ? "page" : undefined}
              onClick={() => go(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
