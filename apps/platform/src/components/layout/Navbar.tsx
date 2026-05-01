import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Settings, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "Главная", to: "/" },
  { label: "Наборы", to: "/collections" },
  { label: "Задачи", to: "/challenges" },
] as const;

export function Navbar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const isChallengePage = pathname.startsWith("/challenges/");

  useEffect(() => {
    if (!isOpen && !isProfileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsProfileOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 720) {
        setIsOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (
        isProfileOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, isProfileOpen]);

  const closeMenus = () => {
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Основная навигация">
      <div className={isChallengePage ? "nav-inner nav-inner-editor" : "nav-inner"}>
        <Link to="/" className="nav-logo" aria-label="Foruntendo" onClick={closeMenus}>
          <span>Foruntendo</span>
        </Link>

        <div id="primary-navigation" className={isOpen ? "nav-links is-open" : "nav-links"}>
          {navItems.map((item) => {
            const isActive =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(`${item.to}/`);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={isActive ? "nav-link active" : "nav-link"}
                onClick={closeMenus}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="nav-right">
          <div className="nav-profile-menu" ref={profileMenuRef}>
            <button
              type="button"
              className="nav-profile-button"
              aria-expanded={isProfileOpen}
              aria-controls="profile-navigation"
              aria-label="Открыть меню профиля"
              onClick={() => setIsProfileOpen((current) => !current)}
            >
              <span>K</span>
            </button>

            <div
              id="profile-navigation"
              className={isProfileOpen ? "profile-dropdown is-open" : "profile-dropdown"}
            >
              <Link to="/profile" className="profile-dropdown-item" onClick={closeMenus}>
                <UserRound size={16} strokeWidth={2.25} />
                <span>Профиль</span>
              </Link>
              <Link to="/settings" className="profile-dropdown-item" onClick={closeMenus}>
                <Settings size={16} strokeWidth={2.25} />
                <span>Настройки</span>
              </Link>
            </div>
          </div>

          <button
            type="button"
            className="nav-menu-button"
            aria-expanded={isOpen}
            aria-controls="primary-navigation"
            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? <X size={18} strokeWidth={2.25} /> : <Menu size={18} strokeWidth={2.25} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
