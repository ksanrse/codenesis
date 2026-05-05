import { CheckCircle2, ChevronDown, ChevronUp, LoaderCircle, Terminal, XCircle } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import type { TestResult } from "../../lib/test-runner.ts";

interface OutputPanelProps {
  expectedTests: string[];
  output: string;
  testResults: TestResult[];
  isRunning: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onHeaderPointerDown?: (event: React.PointerEvent<HTMLElement>) => void;
  hideHeader?: boolean;
}

type VisibleTest = {
  name: string;
  status: "fail" | "pass" | "running";
  error?: string;
};

export const OutputPanel = forwardRef<HTMLDivElement, OutputPanelProps>(function OutputPanel(
  {
    expectedTests,
    output,
    testResults,
    isRunning,
    collapsed = false,
    onToggleCollapse,
    onHeaderPointerDown,
    hideHeader = false,
  },
  ref,
) {
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

  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    const next = new Set<number>();
    visibleTests.forEach((test, index) => {
      if (test.status === "fail" && test.error) next.add(index);
    });
    setExpanded(next);
  }, [testResults]);

  const toggle = (index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const className = [
    "output-panel",
    hasActivity ? "has-results" : "",
    collapsed ? "is-collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={className}>
      {!hideHeader && (
        <div
          className="output-header is-draggable is-draggable-y"
          onPointerDown={onHeaderPointerDown}
        >
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
          {onToggleCollapse && (
            <button
              type="button"
              className="panel-tab-icon panel-tab-collapse output-collapse"
              aria-label={collapsed ? "Развернуть вывод" : "Свернуть вывод"}
              onClick={onToggleCollapse}
            >
              {collapsed ? (
                <ChevronUp size={16} strokeWidth={2.25} />
              ) : (
                <ChevronDown size={16} strokeWidth={2.25} />
              )}
            </button>
          )}
        </div>
      )}
      {hideHeader && total > 0 && (
        <div className="output-header output-header-compact">
          <span className="test-summary">
            <span className="test-passed">{passed} пройдено</span>
            {failed > 0 && <span className="test-failed">{failed} ошибок</span>}
            <span className="test-total">{total} всего</span>
          </span>
          {isRunning && <span className="output-running shimmer-text">Запуск тестов...</span>}
        </div>
      )}

      {visibleTests.length > 0 && (
        <div className="test-results">
          {visibleTests.map((test, index) => {
            const hasDetails = test.status === "fail" && Boolean(test.error);
            const isOpen = hasDetails && expanded.has(index);
            const rowClass = [
              "test-result",
              `test-${test.status}`,
              hasDetails ? "test-result-clickable" : "",
              isOpen ? "is-open" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div key={`${test.name}:${index}`} className={rowClass}>
                <button
                  type="button"
                  className="test-result-row"
                  onClick={hasDetails ? () => toggle(index) : undefined}
                  disabled={!hasDetails}
                  aria-expanded={hasDetails ? isOpen : undefined}
                >
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
                  {hasDetails && (
                    <ChevronDown
                      className="test-result-chevron"
                      size={14}
                      strokeWidth={2.25}
                      aria-hidden
                    />
                  )}
                </button>
                {hasDetails && isOpen && (
                  <pre className="test-result-error">{test.error}</pre>
                )}
              </div>
            );
          })}
        </div>
      )}

      {total === 0 && (
        <pre className={isRunning ? "output-terminal output-terminal-running" : "output-terminal"}>
          {output || "Запусти тесты, чтобы проверить решение."}
        </pre>
      )}
    </div>
  );
});
