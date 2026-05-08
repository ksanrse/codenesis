import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  type ChallengeCollection,
  RANK_BANDS,
  getAllChallenges,
  getChallengeCollections,
} from "@foruntendo/challenges";
import { type CSSProperties, useEffect, useMemo, useRef } from "react";
import { useDatabaseSnapshot } from "../hooks/useDatabaseSnapshot.ts";
import { getCollectionProgress } from "../lib/collection-progress.ts";
import type { ChallengeAttempt } from "../lib/local-db.ts";
import { getPassedChallengeIds } from "../lib/progress.ts";
import { routeTree } from "./__root.tsx";

export const indexRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "/",
  component: HomePage,
});

interface ActivityDay {
  count: number;
  key: string;
}

interface ActivityMonth {
  cells: Array<ActivityDay | null>;
  label: string;
}

function sortCollections(
  collections: ChallengeCollection[],
  activeCollectionId: string | undefined,
): ChallengeCollection[] {
  return [...collections].sort((left, right) => {
    if (left.id === activeCollectionId) return -1;
    if (right.id === activeCollectionId) return 1;
    return left.title.localeCompare(right.title);
  });
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat("ru", { month: "short" }).format(date).replace(".", "");
}

function buildActivity(attempts: ChallengeAttempt[]) {
  const today = new Date();
  const firstMonth = new Date(today.getFullYear(), today.getMonth() - 11, 1);

  const attemptsByDay = new Map<string, number>();
  const periodAttempts = attempts.filter((attempt) => new Date(attempt.createdAt) >= firstMonth);
  for (const attempt of periodAttempts) {
    const key = toDateKey(new Date(attempt.createdAt));
    attemptsByDay.set(key, (attemptsByDay.get(key) ?? 0) + 1);
  }

  const allDays: ActivityDay[] = [];
  const months: ActivityMonth[] = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthStart = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + monthIndex, 1);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    const firstWeekday = monthStart.getDay();
    const cells: Array<ActivityDay | null> = Array.from({ length: firstWeekday }, () => null);

    for (let day = 1; day <= monthEnd.getDate(); day++) {
      const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
      if (date > today) {
        cells.push(null);
        continue;
      }

      const key = toDateKey(date);
      const activityDay = { count: attemptsByDay.get(key) ?? 0, key };
      cells.push(activityDay);
      allDays.push(activityDay);
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return {
      cells,
      label: getMonthLabel(monthStart),
    };
  });

  let currentStreak = 0;
  let maxStreak = 0;
  for (const day of allDays) {
    if (day.count > 0) {
      currentStreak += 1;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return {
    activeDays: allDays.filter((day) => day.count > 0).length,
    completions: periodAttempts.filter((attempt) => attempt.status === "passed").length,
    maxStreak,
    months,
  };
}

function HomePage() {
  const navigate = useNavigate();
  const activityScrollRef = useRef<HTMLDivElement>(null);
  const activityTodayRef = useRef<HTMLSpanElement>(null);
  const { activeCollectionId, attempts } = useDatabaseSnapshot();
  const challenges = useMemo(() => getAllChallenges(), []);
  const collections = useMemo(
    () =>
      sortCollections(
        getChallengeCollections().filter((collection) => !collection.parentCollectionId),
        activeCollectionId,
      ),
    [activeCollectionId],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const scrollElement = activityScrollRef.current;
      const todayElement = activityTodayRef.current;
      if (!scrollElement || !todayElement) return;

      const scrollRect = scrollElement.getBoundingClientRect();
      const todayRect = todayElement.getBoundingClientRect();
      const rightInset = 18;
      const nextScrollLeft =
        scrollElement.scrollLeft + todayRect.right - scrollRect.right + rightInset;

      scrollElement.scrollLeft = Math.max(0, nextScrollLeft);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [attempts]);

  const passedChallengeIds = useMemo(() => getPassedChallengeIds(attempts), [attempts]);
  const solved = passedChallengeIds.size;
  const total = challenges.length;
  const solvedPercent = total === 0 ? 0 : Math.round((solved / total) * 100);
  const activity = useMemo(() => buildActivity(attempts), [attempts]);
  const todayKey = toDateKey(new Date());
  const continueCollections = useMemo(
    () =>
      collections.filter((collection) => {
        const progress = getCollectionProgress(collection, attempts);
        return collection.id === activeCollectionId || progress.completed > 0;
      }),
    [collections, attempts, activeCollectionId],
  );

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Прогресс по задачам, наборам и активности за год.</p>
      </div>

      <section className="dashboard-section">
        <h2>Прогресс в одном месте</h2>
        <div className="dashboard-summary-grid">
          <article className="dashboard-panel solved-panel">
            <h3>Решенные задачи</h3>
            <div className="solved-panel-body">
              <div
                className="solved-ring"
                style={{ "--progress": `${solvedPercent}%` } as CSSProperties}
              >
                <svg className="solved-ring-svg" viewBox="0 0 120 120" aria-hidden="true">
                  <circle className="solved-ring-track" cx="60" cy="60" r="52" pathLength="100" />
                  <circle
                    className="solved-ring-progress"
                    cx="60"
                    cy="60"
                    r="52"
                    pathLength="100"
                    style={{ strokeDasharray: `${solvedPercent} 100` }}
                  />
                </svg>
                <div>
                  <strong>{solved}</strong>
                  <span>решено</span>
                </div>
              </div>
            </div>
          </article>
          <article className="dashboard-panel difficulty-panel">
            <h3>По типам задач</h3>
            <div className="difficulty-panel-body">
              <div className="difficulty-grid">
                {RANK_BANDS.map((band) => {
                  const difficultyTotal = challenges.filter(
                    (challenge) => challenge.rank >= band.from && challenge.rank <= band.to,
                  ).length;
                  const difficultySolved = challenges.filter(
                    (challenge) =>
                      challenge.rank >= band.from &&
                      challenge.rank <= band.to &&
                      passedChallengeIds.has(challenge.id),
                  ).length;
                  const percent =
                    difficultyTotal === 0
                      ? 0
                      : Math.round((difficultySolved / difficultyTotal) * 100);

                  return (
                    <div
                      key={band.id}
                      className={`difficulty-ring ${difficultyTotal === 0 ? "empty" : ""}`}
                      title={`${band.label} · ${difficultySolved}/${difficultyTotal}`}
                    >
                      <svg className="difficulty-ring-svg" viewBox="0 0 60 60" aria-hidden="true">
                        <circle
                          className="difficulty-ring-track"
                          cx="30"
                          cy="30"
                          r="26"
                          pathLength="100"
                        />
                        <circle
                          className="difficulty-ring-progress"
                          cx="30"
                          cy="30"
                          r="26"
                          pathLength="100"
                          style={{ strokeDasharray: `${percent} 100` }}
                        />
                      </svg>
                      <div className="difficulty-ring-label">
                        <strong>{band.label}</strong>
                        <span>
                          {difficultySolved}/{difficultyTotal}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="dashboard-panel activity-panel">
        <div className="activity-header">
          <h2>{activity.completions} решений за последний год</h2>
          <div>
            <span>Активных дней: {activity.activeDays}</span>
            <span>Макс. серия: {activity.maxStreak}</span>
          </div>
        </div>
        <div className="activity-scroll" ref={activityScrollRef}>
          <div className="activity-month-grid">
            {activity.months.map((month) => (
              <div key={month.label} className="activity-month">
                <div className="activity-month-cells">
                  {month.cells.map((day, index) =>
                    day ? (
                      <span
                        key={day.key}
                        ref={day.key === todayKey ? activityTodayRef : undefined}
                        className={`activity-cell level-${Math.min(day.count, 4)}`}
                        title={`${day.key}: ${day.count}`}
                      />
                    ) : (
                      <span key={`${month.label}-${index}`} className="activity-cell empty" />
                    ),
                  )}
                </div>
                <span className="activity-month-label">{month.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="activity-legend">
          <span>Меньше</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <i key={level} className={`activity-cell level-${level}`} />
          ))}
          <span>Больше</span>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Продолжить обучение</h2>
          <p>Здесь появляются выбранный набор и наборы, где уже есть решенные задачи.</p>
        </div>
        {continueCollections.length > 0 ? (
          <div className="continue-grid">
            {continueCollections.map((collection) => {
              const progress = getCollectionProgress(collection, attempts);
              const isActive = collection.id === activeCollectionId;

              return (
                <button
                  key={collection.id}
                  type="button"
                  className={`continue-card ${isActive ? "active" : ""}`}
                  onClick={() =>
                    void navigate({
                      to: "/collections/$collectionId",
                      params: { collectionId: collection.id },
                    })
                  }
                >
                  <div className="mini-ring">
                    <svg className="mini-ring-svg" viewBox="0 0 60 60" aria-hidden="true">
                      <circle className="mini-ring-track" cx="30" cy="30" r="26" pathLength="100" />
                      <circle
                        className="mini-ring-progress"
                        cx="30"
                        cy="30"
                        r="26"
                        pathLength="100"
                        style={{ strokeDasharray: `${progress.percent} 100` }}
                      />
                    </svg>
                    <span>{progress.percent}%</span>
                  </div>
                  <div>
                    <h3>{collection.title}</h3>
                    <p>{collection.description}</p>
                    <span className="collection-meta">
                      {progress.completed}/{progress.total} задач · {collection.tag}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="dashboard-empty">
            <h3>Обучение еще не начато</h3>
            <p>Открой набор и нажми “Начать обучение”, либо реши первую задачу из набора.</p>
            <Link to="/collections" className="btn btn-primary btn-sm">
              Выбрать набор
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
