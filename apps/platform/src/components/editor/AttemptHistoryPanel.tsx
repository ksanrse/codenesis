import { ArrowLeft } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { ChallengeAttempt } from "../../lib/local-db.ts";

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

function highlightJavaScriptCode(code: string) {
  const tokenPattern =
    /(\/\/.*|\/\*[\s\S]*?\*\/|`(?:\\[\s\S]|[^`\\])*`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b(?:export|function|const|let|var|return|if|else|switch|case|default|throw|new|true|false|null|undefined|class|extends|import|from|async|await)\b|\b\d+(?:\.\d+)?n?\b)/g;
  const keywordPattern =
    /^(export|function|const|let|var|return|if|else|switch|case|default|throw|new|class|extends|import|from|async|await)$/;
  const literalPattern = /^(true|false|null|undefined)$/;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let tokenIndex = 0;

  for (const match of code.matchAll(tokenPattern)) {
    const token = match[0];
    const index = match.index ?? 0;
    if (index > lastIndex) nodes.push(code.slice(lastIndex, index));

    const className =
      token.startsWith("//") || token.startsWith("/*")
        ? "syntax-comment"
        : token.startsWith("'") || token.startsWith('"') || token.startsWith("`")
          ? "syntax-string"
          : keywordPattern.test(token)
            ? "syntax-keyword"
            : literalPattern.test(token)
              ? "syntax-literal"
              : /^\d/.test(token)
                ? "syntax-number"
                : undefined;

    nodes.push(
      className ? (
        <span key={`${tokenIndex}:${index}`} className={className}>
          {token}
        </span>
      ) : (
        token
      ),
    );
    lastIndex = index + token.length;
    tokenIndex += 1;
  }

  if (lastIndex < code.length) nodes.push(code.slice(lastIndex));
  return nodes;
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
