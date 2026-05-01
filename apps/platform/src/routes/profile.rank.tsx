import { Link, createRoute } from "@tanstack/react-router";
import {
  CHALLENGE_LEVEL_MMR,
  MMR_GRADE_BANDS,
  RANK_BANDS,
  getRankProgress,
} from "@foruntendo/challenges";
import { useDatabaseSnapshot } from "../hooks/useDatabaseSnapshot.ts";
import { getMmrScore } from "../lib/progress.ts";
import { routeTree } from "./__root.tsx";

export const profileRankRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "/profile/rank",
  component: ProfileRankPage,
});

function formatMmrRange(from: number, to: number): string {
  return Number.isFinite(to) ? `${from}-${to} MMR` : `${from}+ MMR`;
}

function formatRemainingScore(score: number): string {
  if (score <= 0) {
    return "Максимальный уровень текущей шкалы";
  }

  return `${score} MMR до следующего уровня`;
}

function ProfileRankPage() {
  const { attempts } = useDatabaseSnapshot();
  const mmrScore = getMmrScore(attempts);
  const rankProgress = getRankProgress(mmrScore);

  return (
    <div className="container rank-page">
      <div className="rank-hero">
        <div className="rank-hero-copy">
          <Link to="/profile" className="inline-link">
            ← Профиль
          </Link>
          <h1>MMR и уровень</h1>
          <p className="page-subtitle">
            MMR растет за первую успешную сдачу уникальной задачи. F-уровень показывает сложность
            задачи, а профильный уровень показывает общий накопленный прогресс.
          </p>
        </div>

        <aside className="rank-current-card" aria-label="Текущий MMR">
          <div className="rank-current-card-top">
            <span>Текущий уровень</span>
            <strong>{mmrScore}</strong>
            <small>
              {rankProgress.title} · {rankProgress.progressPercent}%
            </small>
          </div>
          <div className="rank-current-progress" aria-hidden="true">
            <span style={{ width: `${rankProgress.progressPercent}%` }} />
          </div>
          <p>{formatRemainingScore(rankProgress.remainingScore)}</p>
        </aside>
      </div>

      <section className="rank-section profile-level-section">
        <div className="rank-section-header">
          <div>
            <h2>Уровень профиля</h2>
            <p>
              Шкала показывает накопленную практику по уникально решенным задачам. Если сложность
              задачи изменится позже, MMR пересчитается по новой сложности.
            </p>
          </div>
        </div>

        <div className="profile-grade-grid">
          {MMR_GRADE_BANDS.map((grade, index) => {
            const isCurrent = rankProgress.rank === index;
            return (
              <article
                key={grade.id}
                className={isCurrent ? "profile-grade-card active" : "profile-grade-card"}
              >
                <div className="profile-grade-card-main">
                  <span className="profile-grade-index">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{grade.label}</strong>
                    <p>{grade.description}</p>
                  </div>
                </div>
                <span className="profile-grade-range">{formatMmrRange(grade.from, grade.to)}</span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rank-section">
        <div className="rank-section-header">
          <div>
            <h2>Уровни задач</h2>
            <p>
              Чем выше F-уровень, тем больше MMR задача дает после полного прохождения. Уровень
              выбирается по тому, сколько самостоятельного проектирования требует решение.
            </p>
          </div>
        </div>

        <div className="challenge-level-grid">
          {RANK_BANDS.map((band, index) => (
            <article key={band.id} className="challenge-level-card">
              <div className="challenge-level-card-head">
                <span className={`challenge-level-mark rank-tone-${index}`}>{band.label}</span>
                <span className="challenge-level-mmr">{CHALLENGE_LEVEL_MMR[index]} MMR</span>
              </div>
              <p className="challenge-level-summary">{band.description}</p>
              <dl className="challenge-level-details">
                <div>
                  <dt>Сигнал</dt>
                  <dd>{band.technicalLevel}</dd>
                </div>
                <div>
                  <dt>Когда ставить</dt>
                  <dd>{band.assignmentRule}</dd>
                </div>
                <div>
                  <dt>Ориентир Google</dt>
                  <dd>{band.googleMapping}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
