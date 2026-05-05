interface LanguageIconProps {
  language: string;
  size?: number;
  className?: string;
}

const LANGUAGE_LABEL: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  react: "React",
  svelte: "Svelte",
  vue: "Vue",
};

export function LanguageIcon({ language, size = 20, className }: LanguageIconProps) {
  const label = LANGUAGE_LABEL[language] ?? language;

  if (language === "javascript") {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        role="img"
        aria-label={label}
      >
        <rect width="24" height="24" rx="3" fill="#F7DF1E" />
        <path
          fill="#000"
          d="M14.97 18.95c.5.82 1.16 1.42 2.32 1.42.97 0 1.6-.49 1.6-1.16 0-.8-.64-1.09-1.71-1.56l-.59-.25c-1.7-.72-2.83-1.63-2.83-3.55 0-1.77 1.35-3.11 3.45-3.11 1.5 0 2.58.52 3.35 1.89l-1.83 1.18c-.4-.73-.84-1.02-1.52-1.02-.69 0-1.13.44-1.13 1.02 0 .71.44 1 1.45 1.43l.59.25c2 .86 3.13 1.74 3.13 3.71 0 2.13-1.67 3.28-3.91 3.28-2.19 0-3.61-1.04-4.3-2.41zm-8.5.21c.36.65.69 1.2 1.49 1.2.77 0 1.25-.3 1.25-1.46v-7.94h2.35v7.97c0 2.43-1.43 3.54-3.51 3.54-1.88 0-2.97-.97-3.52-2.14z"
        />
      </svg>
    );
  }

  if (language === "typescript") {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        role="img"
        aria-label={label}
      >
        <rect width="24" height="24" rx="3" fill="#3178C6" />
        <path
          fill="#fff"
          d="M9.6 11.2v1.66h2.64v8h1.92v-8h2.64v-1.66zm10.07 8.36c.31.63.95 1.16 1.93 1.16.94 0 1.55-.47 1.55-1.13 0-.78-.62-1.05-1.66-1.51l-.57-.24c-1.65-.7-2.74-1.58-2.74-3.45 0-1.71 1.31-3.02 3.34-3.02 1.45 0 2.5.51 3.25 1.83l-1.78 1.14c-.39-.7-.81-.98-1.47-.98-.66 0-1.09.42-1.09.98 0 .69.43.98 1.41 1.4l.57.24c1.94.83 3.04 1.69 3.04 3.6 0 2.06-1.62 3.18-3.79 3.18-2.13 0-3.5-1.01-4.17-2.34z"
          transform="translate(-7 0)"
        />
      </svg>
    );
  }

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: 3,
        background: "var(--bg-muted)",
        color: "var(--text-heading)",
        fontSize: size * 0.45,
        fontWeight: 700,
        letterSpacing: 0,
      }}
      aria-label={label}
    >
      {language.slice(0, 2).toUpperCase()}
    </span>
  );
}
