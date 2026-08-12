<script lang="ts">
  import { getAllChallenges } from "@codenesis/challenges";
  import { roadmaps } from "../lib/roadmaps";

  const challenges = getAllChallenges();
  const go = (path: string) => { window.location.hash = path; };
</script>

<div class="container dashboard-home">
  <section class="hero-panel">
    <p class="eyebrow">Codenesis</p>
    <h1>Практика, которая остаётся с вами</h1>
    <p>Решайте задачи, запускайте тесты прямо в браузере и собирайте свой прогресс по рангам.</p>
    <div class="hero-actions">
      <button class="btn btn-primary" type="button" on:click={() => go("/challenges")}>Открыть задачи</button>
      <button class="btn btn-outline" type="button" on:click={() => go("/roadmaps")}>Открыть roadmap</button>
    </div>
  </section>

  <section class="home-section">
    <div class="section-heading"><h2>Ваш учебный центр</h2><span>{challenges.length} задач</span></div>
    <div class="home-grid">
      <button class="home-card" type="button" on:click={() => go("/challenges")}><strong>Все задачи</strong><span>Фильтры по уровню, языку и теме</span></button>
      <button class="home-card" type="button" on:click={() => go("/roadmaps")}><strong>Roadmaps</strong><span>{roadmaps.length} последовательный путь от основ до проекта</span></button>
      <button class="home-card" type="button" on:click={() => go("/profile")}><strong>Профиль</strong><span>Прогресс, ранг и история попыток</span></button>
    </div>
  </section>
</div>

<style>
  .dashboard-home { display: grid; gap: 28px; }
  .hero-panel { padding: clamp(28px, 6vw, 64px); border: 1px solid var(--border-color, #2b3038); border-radius: 16px; background: #11151b; }
  .eyebrow { margin: 0 0 18px; color: #9ebdff; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
  h1 { max-width: 700px; margin: 0; color: var(--text-primary, #f4f6f8); font-size: clamp(28px, 5vw, 52px); line-height: 1.05; letter-spacing: -.045em; }
  .hero-panel > p:not(.eyebrow) { max-width: 580px; margin: 20px 0 0; color: var(--text-secondary, #a9b0bb); font-size: 15px; line-height: 1.6; }
  .hero-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
  .home-section { display: grid; gap: 14px; }
  .section-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
  .section-heading h2 { margin: 0; color: var(--text-primary, #f4f6f8); font-size: 18px; }
  .section-heading span { color: var(--text-muted, #737c8b); font-size: 12px; }
  .home-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .home-card { display: grid; gap: 8px; min-height: 120px; padding: 20px; border: 1px solid var(--border-color, #2b3038); border-radius: 12px; background: #11151b; color: inherit; text-align: left; cursor: pointer; }
  .home-card:hover { border-color: #68748a; }
  .home-card strong { color: var(--text-primary, #f4f6f8); font-size: 14px; }
  .home-card span { color: var(--text-secondary, #a9b0bb); font-size: 12px; line-height: 1.45; }
  @media (max-width: 720px) { .home-grid { grid-template-columns: 1fr; } }
</style>
