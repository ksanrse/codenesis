import { CheckCircle2, LoaderCircle, Terminal, XCircle } from "lucide-react";
import type { TestResult } from "../../lib/test-runner.ts";

interface OutputPanelProps {
  expectedTests: string[];
  output: string;
  testResults: TestResult[];
  isRunning: boolean;
}

type VisibleTest = {
  name: string;
  status: "fail" | "pass" | "running";
};

export function OutputPanel({ expectedTests, output, testResults, isRunning }: OutputPanelProps) {
  const passed = testResults.filter((test) => test.status === "pass").length;
  const failed = testResults.filter((test) => test.status === "fail").length;
  const total = testResults.length;
  const hasActivity = isRunning || total > 0;
  const visibleTests: VisibleTest[] =
    testResults.length > 0
      ? testResults
      : isRunning
        ? expectedTests.map((name) => ({ name, status: "running" }))
        : [];

  return (
    <div className={hasActivity ? "output-panel has-results" : "output-panel"}>
      <div className="output-header">
        <span className="output-title">
          <Terminal size={13} strokeWidth={2.25} />
          Вывод
        </span>
        {total > 0 && (
          <span className="test-summary">
            <span className="test-passed">{passed} пройдено</span>
            {failed > 0 && <span className="test-failed">{failed} ошибок</span>}
            <span className="test-total">{total} всего</span>
          </span>
        )}
        {isRunning && <span className="output-running shimmer-text">Запуск тестов...</span>}
      </div>

      {visibleTests.length > 0 && (
        <div className="test-results">
          {visibleTests.map((test, index) => (
            <div key={`${test.name}:${index}`} className={`test-result test-${test.status}`}>
              <span className="test-icon">
                {test.status === "pass" ? (
                  <CheckCircle2 size={15} strokeWidth={2.35} />
                ) : test.status === "fail" ? (
                  <XCircle size={15} strokeWidth={2.35} />
                ) : (
                  <LoaderCircle size={15} strokeWidth={2.35} />
                )}
              </span>
              <span className="test-name">{test.name}</span>
              {test.status === "running" && (
                <span className="test-state shimmer-text">running</span>
              )}
            </div>
          ))}
        </div>
      )}

      <pre className={isRunning ? "output-terminal output-terminal-running" : "output-terminal"}>
        {output || "Запусти тесты, чтобы проверить решение."}
      </pre>
    </div>
  );
}
