<script lang="ts">
  import {
    CHALLENGE_LEVEL_MMR,
    MMR_GRADE_BANDS,
    RANK_BANDS,
    getRankProgress,
  } from "@codenesis/challenges";
  import { attempts } from "../../lib/database-store.ts";
  import { getMmrScore } from "../../lib/progress.ts";

  $: score = getMmrScore($attempts);
  $: rank = getRankProgress(score);
</script>

<div class="container rank-page">
  <div class="rank-hero"><div class="rank-hero-copy"><a href="#/profile" class="inline-link">← Профиль</a><h1>MMR и уровень</h1><p class="page-subtitle">MMR растет за первую успешную сдачу уникальной задачи.</p></div><aside class="rank-current-card"><div class="rank-current-card-top"><span>Текущий уровень</span><strong>{score}</strong><small>{rank.title} · {rank.progressPercent}%</small></div><div class="rank-current-progress"><span style={`width:${rank.progressPercent}%`}></span></div><p>{rank.remainingScore > 0 ? `${rank.remainingScore} MMR до следующего уровня` : "Максимальный уровень текущей шкалы"}</p></aside></div>
  <section class="rank-section"><div class="rank-section-header"><h2>Уровень профиля</h2><p>Шкала показывает накопленную практику по уникально решенным задачам.</p></div><div class="profile-grade-grid">{#each MMR_GRADE_BANDS as grade, index}<article class:active={rank.rank === index} class="profile-grade-card"><div class="profile-grade-card-main"><span class="profile-grade-index">{String(index + 1).padStart(2, "0")}</span><div><strong>{grade.label}</strong><p>{grade.description}</p></div></div><span class="profile-grade-range">{Number.isFinite(grade.to) ? `${grade.from}-${grade.to}` : `${grade.from}+`} MMR</span></article>{/each}</div></section>
  <section class="rank-section"><div class="rank-section-header"><h2>Уровни задач</h2><p>Чем выше F-уровень, тем больше MMR задача дает после полного прохождения.</p></div><div class="challenge-level-grid">{#each RANK_BANDS as band, index}<article class="challenge-level-card"><div class="challenge-level-card-head"><span class={`challenge-level-mark rank-tone-${index}`}>{band.label}</span><span class="challenge-level-mmr">{CHALLENGE_LEVEL_MMR[index]} MMR</span></div><p class="challenge-level-summary">{band.description}</p></article>{/each}</div></section>
</div>
