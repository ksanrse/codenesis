<script lang="ts">
  import { getChallengeCollections, getRankProgress } from "@codenesis/challenges";
  import { attempts } from "../lib/database-store.ts";
  import { getMmrScore, getPassedChallengeIds } from "../lib/progress.ts";

  const collections = getChallengeCollections();
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("ru", { dateStyle: "medium", timeStyle: "short" }).format(
      new Date(value),
    );
  $: passed = $attempts.filter((attempt) => attempt.status === "passed").length;
  $: passedIds = getPassedChallengeIds($attempts);
  $: rank = getRankProgress(getMmrScore($attempts));
</script>

<div class="container">
  <div class="page-header"><h1>Профиль</h1><p class="page-subtitle">Все сохраненные попытки решения и результаты тестов.</p></div>
  <section class="profile-rank-panel"><div class="profile-rank-main"><span class="profile-rank-kicker">Текущий уровень</span><div class="profile-rank-value">{rank.title}</div><div class="profile-rank-title">{rank.score} MMR</div><a href="#/profile/rank" class="profile-rank-link">Подробнее</a></div><div class="profile-rank-progress"><div class="profile-rank-score"><span>{rank.score} MMR</span><span>{rank.nextTitle ? `до уровня ${rank.nextTitle}: ${rank.remainingScore} MMR` : "верхний уровень текущей шкалы"}</span></div><div class="skill-progress" aria-label={`${rank.progressPercent}%`}><span style={`width:${rank.progressPercent}%`}></span></div><p>MMR начисляется один раз за первую успешную сдачу задачи.</p></div></section>
  <div class="profile-stats"><div><span class="knowledge-stat-value">{$attempts.length}</span><span class="knowledge-stat-label">попыток</span></div><div><span class="knowledge-stat-value">{passed}</span><span class="knowledge-stat-label">успешных</span></div><div><span class="knowledge-stat-value">{$attempts.length ? Math.round((passed / $attempts.length) * 100) : 0}%</span><span class="knowledge-stat-label">проходов</span></div></div>
  <section class="skill-section"><div class="section-heading"><h2>Навыки</h2><p>Прогресс растет, когда задача успешно проходит все тесты.</p></div><div class="skill-list">{#each collections as collection}<article class="skill-row"><div class="skill-row-header"><div><div class="attempt-title">{collection.skillLabel}</div><div class="attempt-meta">{collection.tag}</div></div><span class="skill-score">{collection.challengeIds.filter((id) => passedIds.has(id)).length}/{collection.challengeCount}</span></div><div class="skill-progress"><span style={`width:${collection.challengeCount ? Math.round(collection.challengeIds.filter((id) => passedIds.has(id)).length / collection.challengeCount * 100) : 0}%`}></span></div></article>{/each}</div></section>
  <div class="attempt-list">{#each $attempts as attempt}<article class="attempt-row"><div><div class="attempt-title">{attempt.challengeTitle}</div><div class="attempt-meta">{formatDate(attempt.createdAt)} · {attempt.language}</div></div><div class="attempt-result"><span class:test-passed={attempt.status === "passed"} class:test-failed={attempt.status !== "passed"}>{attempt.status === "passed" ? "пройдено" : "ошибка"}</span><span>{attempt.passed}/{attempt.total || attempt.passed + attempt.failed} тестов</span></div></article>{:else}<p class="empty-state">Пока нет попыток.</p>{/each}</div>
</div>
