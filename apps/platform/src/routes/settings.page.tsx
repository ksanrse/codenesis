import { useEffect, useState } from "react";

type Theme = "system" | "dark" | "light";

const THEME_LABELS: Record<Theme, string> = {
  system: "Системная",
  dark: "Тёмная",
  light: "Светлая",
};

function getSavedTheme(): Theme {
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light" || saved === "system") return saved;
  return "system";
}

function resolveEffectiveTheme(theme: Theme): "dark" | "light" {
  if (theme === "system") {
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

export function SettingsPage() {
  const [theme, setTheme] = useState<Theme>(getSavedTheme);

  useEffect(() => {
    function apply() {
      document.documentElement.setAttribute("data-theme", resolveEffectiveTheme(theme));
    }

    apply();
    localStorage.setItem("theme", theme);

    if (theme !== "system") return;

    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Настройки</h1>
        <p className="page-subtitle">Тема интерфейса и спокойные глобальные настройки.</p>
      </div>

      <section className="settings-section">
        <div className="section-heading">
          <h2>Интерфейс</h2>
          <p>Переключатель темы вынесен сюда, чтобы верхняя навигация оставалась спокойной.</p>
        </div>
        <div className="settings-panel">
          <div>
            <div className="attempt-title">Тема</div>
            <div className="attempt-meta">{THEME_LABELS[theme]}</div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {(["system", "dark", "light"] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`btn btn-sm ${theme === t ? "btn-primary" : "btn-outline"}`}
                onClick={() => setTheme(t)}
              >
                {THEME_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="section-heading">
          <h2>Редактор</h2>
          <p>Тема Monaco и шорткаты теперь доступны прямо из меню `...` на странице задачи.</p>
        </div>
      </section>
    </div>
  );
}
