import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type { ChallengeAttempt } from "../../lib/local-db.ts";
import { highlightJavaScriptCode } from "../../lib/syntax-highlight.tsx";

interface AttemptHistoryPanelProps {
  attempts: ChallengeAttempt[];
}

const attemptDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function getAttemptCode(files: Record<string, string>) {
  const entries = Object.entries(files).sort(([leftPath], [rightPath]) =>
    leftPath.localeCompare(rightPath),
  );
  if (entries.length === 0) return "";
  if (entries.length === 1) return entries[0]?.[1] ?? "";

  return entries.map(([path, content]) => `// ${path}\n${content.trimEnd()}`).join("\n\n");
}

function getTotalTests(attempt: ChallengeAttempt) {
  return attempt.total || attempt.passed + attempt.failed;
}

export function AttemptHistoryPanel({ attempts }: AttemptHistoryPanelProps) {
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | undefined>();
  const selectedAttempt = attempts.find((attempt) => attempt.id === selectedAttemptId);

  useEffect(() => {
    setSelectedAttemptId(undefined);
  }, [attempts]);

  if (attempts.length === 0) {
    return (
      <div className="challenge-helper-card">
        <h2>Попыток пока нет</h2>
        <p>Попытка появится после завершения решения, если код отличается от starter-кода.</p>
      </div>
    );
  }

  if (selectedAttempt) {
    const attemptIndex = attempts.findIndex((attempt) => attempt.id === selectedAttempt.id);
    const totalTests = getTotalTests(selectedAttempt);
    const attemptCode = getAttemptCode(selectedAttempt.files);

    return (
      <div className="challenge-attempt-detail-page">
        <button
          type="button"
          className="attempt-back-button"
          onClick={() => setSelectedAttemptId(undefined)}
        >
          <ArrowLeft size={14} />К попыткам
        </button>

        <div className="attempt-detail-header">
          <div>
            <h2>Попытка {attempts.length - attemptIndex}</h2>
            <p>{attemptDateFormatter.format(new Date(selectedAttempt.createdAt))}</p>
          </div>
          <span className={selectedAttempt.status === "passed" ? "test-passed" : "test-failed"}>
            {selectedAttempt.status === "passed" ? "пройдено" : "ошибка"}
          </span>
        </div>

        <div className="attempt-detail-stat">
          <span>Тесты</span>
          <strong>
            {selectedAttempt.passed}/{totalTests}
          </strong>
        </div>

        <section className="attempt-detail-section">
          <h3>Код</h3>
          <pre className="attempt-code-block">
            <code>{highlightJavaScriptCode(attemptCode.trimEnd())}</code>
          </pre>
        </section>
      </div>
    );
  }

  return (
    <div className="challenge-attempts-panel">
      {attempts.map((attempt, index) => {
        const totalTests = getTotalTests(attempt);

        return (
          <article key={attempt.id} className="challenge-attempt-row">
            <button
              type="button"
              className="challenge-attempt-summary"
              onClick={() => setSelectedAttemptId(attempt.id)}
            >
              <span>
                <span className="challenge-attempt-title">Попытка {attempts.length - index}</span>
                <span className="challenge-attempt-meta">
                  {attemptDateFormatter.format(new Date(attempt.createdAt))}
                </span>
              </span>
              <span className="challenge-attempt-result">
                <span className={attempt.status === "passed" ? "test-passed" : "test-failed"}>
                  {attempt.status === "passed" ? "пройдено" : "ошибка"}
                </span>
                <span>
                  {attempt.passed}/{totalTests} тестов
                </span>
              </span>
            </button>
          </article>
        );
      })}
    </div>
  );
}
