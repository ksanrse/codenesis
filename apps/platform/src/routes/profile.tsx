import { Link, createRoute } from "@tanstack/react-router";
import { getChallengeCollections, getRankProgress } from "@foruntendo/challenges";
import { useDatabaseSnapshot } from "../hooks/useDatabaseSnapshot.ts";
import { getMmrScore, getPassedChallengeIds } from "../lib/progress.ts";
import { routeTree } from "./__root.tsx";

export const profileRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "/profile",
  component: ProfilePage,
});

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function ProfilePage() {
  const { attempts } = useDatabaseSnapshot();

  const passed = attempts.filter((attempt) => attempt.status === "passed").length;
  const passedChallengeIds = getPassedChallengeIds(attempts);
  const rankScore = getMmrScore(attempts);
  const rankProgress = getRankProgress(rankScore);
  const collections = getChallengeCollections();

  return (
    <div className="container">
      <div className="page-header">
        <h1>Профиль</h1>
        <p className="page-subtitle">Все сохраненные попытки решения и результаты тестов.</p>
      </div>

      <section className="profile-rank-panel">
        <div className="profile-rank-main">
          <span className="profile-rank-kicker">Текущий уровень</span>
          <div className="profile-rank-value">{rankProgress.title}</div>
          <div className="profile-rank-title">{rankProgress.score} MMR</div>
          <Link to="/profile/rank" className="profile-rank-link">
            Подробнее
          </Link>
        </div>
        <div className="profile-rank-progress">
          <div className="profile-rank-score">
            <span>{rankProgress.score} MMR</span>
            <span>
              {rankProgress.nextTitle
                ? `до уровня ${rankProgress.nextTitle}: ${rankProgress.remainingScore} MMR`
                : "верхний уровень текущей шкалы"}
            </span>
          </div>
          <div className="skill-progress" aria-label={`${rankProgress.progressPercent}%`}>
            <span style={{ width: `${rankProgress.progressPercent}%` }} />
          </div>
          <p>
            MMR начисляется один раз за первую успешную сдачу задачи: F1 дает 2, F2 - 3, F3 - 8, F4
            - 21, F5 - 55, F6 - 149, F7 - 404, F8 - 1097.
          </p>
        </div>
      </section>

      <div className="profile-stats">
        <div>
          <span className="knowledge-stat-value">{attempts.length}</span>
          <span className="knowledge-stat-label">попыток</span>
        </div>
        <div>
          <span className="knowledge-stat-value">{passed}</span>
          <span className="knowledge-stat-label">успешных</span>
        </div>
        <div>
          <span className="knowledge-stat-value">
            {attempts.length === 0 ? 0 : Math.round((passed / attempts.length) * 100)}%
          </span>
          <span className="knowledge-stat-label">проходов</span>
        </div>
      </div>

      <section className="skill-section">
        <div className="section-heading">
          <h2>Навыки</h2>
          <p>Прогресс растет, когда задача из сборника успешно проходит все тесты.</p>
        </div>
        <div className="skill-list">
          {collections.map((collection) => {
            const completed = collection.challengeIds.filter((id) =>
              passedChallengeIds.has(id),
            ).length;
            const percent =
              collection.challengeCount === 0
                ? 0
                : Math.round((completed / collection.challengeCount) * 100);

            return (
              <article key={collection.id} className="skill-row">
                <div className="skill-row-header">
                  <div>
                    <div className="attempt-title">{collection.skillLabel}</div>
                    <div className="attempt-meta">{collection.tag}</div>
                  </div>
                  <span className="skill-score">
                    {completed}/{collection.challengeCount}
                  </span>
                </div>
                <div className="skill-progress" aria-label={`${percent}%`}>
                  <span style={{ width: `${percent}%` }} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="attempt-list">
        {attempts.map((attempt) => (
          <article key={attempt.id} className="attempt-row">
            <div>
              <div className="attempt-title">{attempt.challengeTitle}</div>
              <div className="attempt-meta">
                {formatDate(attempt.createdAt)} · {attempt.language}
              </div>
            </div>
            <div className="attempt-result">
              <span className={attempt.status === "passed" ? "test-passed" : "test-failed"}>
                {attempt.status === "passed" ? "пройдено" : "ошибка"}
              </span>
              <span>
                {attempt.passed}/{attempt.total || attempt.passed + attempt.failed} тестов
              </span>
            </div>
          </article>
        ))}
        {attempts.length === 0 && <p className="empty-state">Пока нет попыток.</p>}
      </div>
    </div>
  );
}
