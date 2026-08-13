<script lang="ts">
  import {
    Background,
    BackgroundVariant,
    Controls,
    SvelteFlow,
    type Edge,
    type NodeEventWithPointer,
  } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import { onMount } from "svelte";
  import SkillTreeNode, { type SkillTreeFlowNode } from "../../components/roadmaps/SkillTreeNode.svelte";
  import FloatingEdge from "../../components/roadmaps/FloatingEdge.svelte";
  import LanguageIcon from "../../components/ui/LanguageIcon.svelte";
  import frontendMark from "../../assets/roadmap-art/frontend-mark.png";
  import backendMark from "../../assets/roadmap-art/backend-mark.png";
  import fullstackMark from "../../assets/roadmap-art/fullstack-mark.png";
  import mlMark from "../../assets/roadmap-art/ml-mark.png";
  import { attempts } from "../../lib/database-store";
  import { developerSkillProgress } from "../../lib/developer-progress";
  import { getPassedChallengeIds } from "../../lib/progress";
  import {
    skillTreeConnections,
    skillTreeDependencies,
    skillTreeRoles,
    skillTreeSkills,
    optionalSkillTreeConnectionKeys,
    type SkillTreeRole,
    type SkillTreeSkill,
  } from "../../lib/roadmaps";

  const nodeTypes = { skillTree: SkillTreeNode };
  const edgeTypes = { floating: FloatingEdge };
  const activeTrackStorageKey = "codenesis:roadmap:active-track";
  const displayDepthStorageKey = "codenesis:roadmap:display-depth";
  const specializationTones = new Set(["react", "vue", "svelte", "solid"]);
  const rolePositions: Record<string, { x: number; y: number }> = {
    "fullstack-role": { x: 410, y: 10 },
    "frontend-role": { x: 100, y: 230 },
    "backend-role": { x: 430, y: 230 },
    "ml-role": { x: 760, y: 230 },
  };
  const skillPositions: Record<string, { x: number; y: number }> = {
    "html-skill": { x: 20, y: 445 },
    "css-skill": { x: 165, y: 445 },
    "javascript-skill": { x: 355, y: 445 },
    "python-skill": { x: 760, y: 445 },
    "databases-skill": { x: 905, y: 445 },
    "react-skill": { x: 190, y: 630 },
    "vue-skill": { x: 335, y: 630 },
    "svelte-skill": { x: 480, y: 630 },
    "solid-skill": { x: 625, y: 630 },
  };
  let routeHash = typeof window === "undefined" ? "" : window.location.hash;
  let selectedRole: SkillTreeRole | null = null;
  let selectedSkill: SkillTreeSkill | null = null;
  let legendOpen = false;
  let depthMenuOpen = false;
  let displayDepth: 1 | 2 = 1;
  let activeRoleId: string | null = null;
  let demoMode = false;
  let holdProgress = 0;
  let cancelCompleted = false;
  let cancelHoldTimer: ReturnType<typeof setTimeout> | null = null;
  let cancelHoldInterval: ReturnType<typeof setInterval> | null = null;
  const roleDisplayNames: Record<string, string> = {
    Frontend: "Фронтенд",
    Backend: "Бэкенд",
    "Full Stack": "Фуллстак",
    ML: "Машинное обучение",
  };

  const getRoleDisplayName = (title: string) => roleDisplayNames[title] ?? title;
  $: passedIds = getPassedChallengeIds($attempts);
  $: demoMode = routeHash.includes("demo=1");
  $: progressBySkill = new Map(
    skillTreeSkills.map((skill) => {
      if (demoMode) {
        return [skill.id, skill.id === "css-skill" ? 1 : skill.id === "javascript-skill" ? 0.5 : 0];
      }
      if ($developerSkillProgress[skill.id] !== undefined) {
        return [skill.id, $developerSkillProgress[skill.id] / 100];
      }
      const completed = skill.exerciseIds.filter((id) => passedIds.has(id)).length;
      return [skill.id, skill.exerciseIds.length ? completed / skill.exerciseIds.length : 0];
    }),
  );
  $: progressByRole = new Map(
    skillTreeRoles.map((role) => {
      const connectedSkills = skillTreeConnections
        .filter((connection) => connection.roleId === role.id)
        .map((connection) => progressBySkill.get(connection.skillId) ?? 0);
      return [role.id, connectedSkills.length ? connectedSkills.reduce((sum, value) => sum + value, 0) / connectedSkills.length : 0];
    }),
  );
  $: activeSkillIds = new Set(
    activeRoleId
      ? skillTreeConnections
          .filter((connection) => connection.roleId === activeRoleId)
          .map((connection) => connection.skillId)
      : [],
  );
  $: activeDependencySkillIds = new Set(
    skillTreeDependencies
      .filter((dependency) => activeSkillIds.has(dependency.sourceSkillId))
      .map((dependency) => dependency.targetSkillId),
  );
  $: visibleSkills = skillTreeSkills.filter(
    (skill) => displayDepth >= 2 || !specializationTones.has(skill.tone),
  );
  $: visibleSkillIds = new Set(visibleSkills.map((skill) => skill.id));
  $: nodes = [
    ...skillTreeRoles.map((role) => ({
      id: role.id,
      type: "skillTree",
      position: rolePositions[role.id],
      width: 220,
      data: {
        title: getRoleDisplayName(role.title),
        shortLabel: role.shortLabel,
        progress: progressByRole.get(role.id) ?? 0,
        tone: role.tone,
        kind: "role" as const,
        meta: `${Math.round((progressByRole.get(role.id) ?? 0) * 100)}% база`,
        hasTarget: role.id === "frontend-role" || role.id === "backend-role",
        hasSource: true,
        dimmed: Boolean(activeRoleId && activeRoleId !== role.id),
        active: activeRoleId === role.id,
        markUrl: role.id === "frontend-role" ? frontendMark : role.id === "backend-role" ? backendMark : role.id === "fullstack-role" ? fullstackMark : role.id === "ml-role" ? mlMark : undefined,
      },
      draggable: true,
      connectable: false,
      deletable: false,
      ariaLabel: `Направление: ${getRoleDisplayName(role.title)}`,
    } satisfies SkillTreeFlowNode)),
    ...visibleSkills.map((skill) => ({
      id: skill.id,
      type: "skillTree",
      position: skillPositions[skill.id],
      width: 124,
      height: 124,
      data: {
        title: skill.title,
        shortLabel: skill.shortLabel,
        progress: progressBySkill.get(skill.id) ?? 0,
        tone: skill.tone,
        kind: "skill" as const,
        meta: `${Math.round((progressBySkill.get(skill.id) ?? 0) * 100)}%`,
        hasTarget: true,
        hasSource: skillTreeDependencies.some(
          (dependency) => dependency.sourceSkillId === skill.id,
        ),
        dimmed: Boolean(
          activeRoleId &&
            !activeSkillIds.has(skill.id) &&
            !activeDependencySkillIds.has(skill.id),
        ),
      },
      draggable: true,
      connectable: false,
      deletable: false,
      ariaLabel: `Навык: ${skill.title}`,
    } satisfies SkillTreeFlowNode)),
  ];
  $: visualConnections = [
    { source: "fullstack-role", target: "frontend-role" },
    { source: "fullstack-role", target: "backend-role" },
    ...skillTreeConnections
      .filter((connection) => connection.roleId !== "fullstack-role")
      .map((connection) => {
        return {
          source: connection.roleId,
          target: connection.skillId,
          optional: optionalSkillTreeConnectionKeys.has(`${connection.roleId}:${connection.skillId}`),
        };
      }),
    ...skillTreeDependencies
      .filter(
        (dependency) =>
          visibleSkillIds.has(dependency.sourceSkillId) &&
          visibleSkillIds.has(dependency.targetSkillId),
      )
      .map((dependency) => ({
        source: dependency.sourceSkillId,
        target: dependency.targetSkillId,
      })),
  ];
  $: edges = visualConnections.map((connection) => {
    const edgeDimmed = Boolean(
      activeRoleId &&
        connection.source !== activeRoleId &&
        !activeSkillIds.has(connection.source),
    );
    return {
      id: `${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      type: "floating",
      style: `stroke:var(--text-muted);stroke-width:2;opacity:${edgeDimmed ? ".12" : ".72"}${connection.optional ? ";stroke-dasharray:7 6" : ""}`,
      className: connection.optional ? "optional-connection" : "animated-connection",
      animated: !connection.optional,
      selectable: false,
    } satisfies Edge;
  });
  $: selectedRoleSkills = selectedRole
    ? skillTreeConnections
        .filter((connection) => connection.roleId === selectedRole.id)
        .map((connection) => skillTreeSkills.find((skill) => skill.id === connection.skillId))
        .filter((skill): skill is SkillTreeSkill => Boolean(skill))
    : [];

  const selectNode: NodeEventWithPointer<MouseEvent | TouchEvent, SkillTreeFlowNode> = ({ node }) => {
    legendOpen = false;
    selectedRole = skillTreeRoles.find((role) => role.id === node.id) ?? null;
    selectedSkill = skillTreeSkills.find((skill) => skill.id === node.id) ?? null;
  };

  function selectTrack(role: SkillTreeRole) {
    setActiveTrack(activeRoleId === role.id ? null : role.id);
    selectedRole = role;
    selectedSkill = null;
  }

  function setDisplayDepth(depth: 1 | 2) {
    displayDepth = depth;
    depthMenuOpen = false;
    if (selectedSkill && !visibleSkillIds.has(selectedSkill.id)) selectedSkill = null;
    try {
      window.localStorage.setItem(displayDepthStorageKey, String(depth));
    } catch {
      // The graph still works when browser storage is unavailable.
    }
  }

  function setActiveTrack(roleId: string | null) {
    activeRoleId = roleId;
    try {
      if (roleId) {
        window.localStorage.setItem(activeTrackStorageKey, roleId);
      } else {
        window.localStorage.removeItem(activeTrackStorageKey);
      }
    } catch {
      // The selection still works when browser storage is unavailable.
    }
  }

  function startCancelHold() {
    if (!selectedRole || activeRoleId !== selectedRole.id || cancelHoldTimer) return;
    cancelCompleted = false;
    holdProgress = 0;
    cancelHoldInterval = setInterval(() => {
      holdProgress = Math.min(100, holdProgress + 100 / 900 * 30);
    }, 30);
    cancelHoldTimer = setTimeout(() => {
      cancelCompleted = true;
      setActiveTrack(null);
      holdProgress = 100;
      stopCancelHold(false);
    }, 900);
  }

  function stopCancelHold(reset = true) {
    if (cancelHoldTimer) clearTimeout(cancelHoldTimer);
    if (cancelHoldInterval) clearInterval(cancelHoldInterval);
    cancelHoldTimer = null;
    cancelHoldInterval = null;
    if (reset) holdProgress = 0;
  }

  function handleTrackAction() {
    if (cancelCompleted) {
      cancelCompleted = false;
      holdProgress = 0;
      return;
    }
    if (!selectedRole) return;
    if (activeRoleId === selectedRole.id) return;
    selectTrack(selectedRole);
  }

  function handleTrackKeyDown(event: KeyboardEvent) {
    if ((event.key === " " || event.key === "Enter") && selectedRole && activeRoleId === selectedRole.id) {
      event.preventDefault();
      startCancelHold();
    }
  }

  function handleTrackKeyUp(event: KeyboardEvent) {
    if ((event.key === " " || event.key === "Enter") && selectedRole && activeRoleId === selectedRole.id) {
      event.preventDefault();
      stopCancelHold();
      handleTrackAction();
    }
  }

  onMount(() => {
    routeHash = window.location.hash;
    try {
      const savedRoleId = window.localStorage.getItem(activeTrackStorageKey);
      if (savedRoleId && skillTreeRoles.some((role) => role.id === savedRoleId)) {
        activeRoleId = savedRoleId;
      } else if (savedRoleId) {
        window.localStorage.removeItem(activeTrackStorageKey);
      }
      displayDepth = window.localStorage.getItem(displayDepthStorageKey) === "2" ? 2 : 1;
    } catch {
      // Storage can be disabled without blocking the roadmap.
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        legendOpen = false;
        depthMenuOpen = false;
        selectedRole = null;
        selectedSkill = null;
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  });
</script>

<svelte:window on:hashchange={() => (routeHash = window.location.hash)} />

<div class="container mx-auto flex w-full max-w-[var(--container-width)] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
  <header>
    <h1 class="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.05em] text-foreground">Skill tree</h1>
  </header>

  <div class="relative h-[calc(100dvh-210px)] min-h-[500px] overflow-hidden rounded-xl border border-border bg-background shadow-panel max-md:mx-[-12px] max-md:h-[650px] max-md:min-h-0" class:demo-mode={demoMode}>
    <button
      class={`absolute left-4 top-4 z-10 inline-flex min-h-9 items-center justify-center rounded-md border px-3 font-mono text-[11px] font-semibold transition ${legendOpen ? "border-border-strong bg-surface-muted text-foreground" : "border-border bg-surface text-muted hover:border-border-strong hover:bg-surface-muted hover:text-foreground"}`}
      type="button"
      aria-label="Открыть пояснения к карте"
      aria-expanded={legendOpen}
      onclick={() => {
        legendOpen = !legendOpen;
        selectedRole = null;
        selectedSkill = null;
      }}
    >Легенда</button>
    <div class="absolute right-4 top-4 z-10">
      <button
        class={`inline-flex min-h-9 items-center gap-2 rounded-md border px-3 font-mono text-[11px] font-semibold transition ${depthMenuOpen ? "border-border-strong bg-surface-muted text-foreground" : "border-border bg-surface text-muted hover:border-border-strong hover:bg-surface-muted hover:text-foreground"}`}
        type="button"
        aria-label="Настроить глубину карты"
        aria-expanded={depthMenuOpen}
        onclick={() => (depthMenuOpen = !depthMenuOpen)}
      >
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <circle cx="7" cy="7" r="2.5" /><circle cx="17" cy="7" r="2.5" /><circle cx="12" cy="17" r="2.5" />
          <path d="m9.2 8.2 1.8 6.4m3.8-6.4L13 14.6" />
        </svg>
        Уровень {displayDepth}
      </button>
      {#if depthMenuOpen}
        <div class="absolute right-0 top-11 grid w-64 overflow-hidden rounded-lg border border-border bg-surface p-1 shadow-float" role="menu" aria-label="Глубина отображения">
          <button class={`grid gap-0.5 rounded-md px-3 py-2.5 text-left hover:bg-surface-muted ${displayDepth === 1 ? "bg-surface-muted" : ""}`} type="button" role="menuitemradio" aria-checked={displayDepth === 1} onclick={() => setDisplayDepth(1)}>
            <span class="text-xs font-semibold text-foreground">Уровень 1 · База</span>
            <span class="text-[11px] leading-4 text-muted">Профессии и основные технологии</span>
          </button>
          <button class={`grid gap-0.5 rounded-md px-3 py-2.5 text-left hover:bg-surface-muted ${displayDepth === 2 ? "bg-surface-muted" : ""}`} type="button" role="menuitemradio" aria-checked={displayDepth === 2} onclick={() => setDisplayDepth(2)}>
            <span class="text-xs font-semibold text-foreground">Уровень 2 · Специализации</span>
            <span class="text-[11px] leading-4 text-muted">React, Vue, Svelte и Solid</span>
          </button>
        </div>
      {/if}
    </div>
    {#key displayDepth}
      <SvelteFlow
        bind:nodes
        bind:edges
        {nodeTypes}
        {edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.12, maxZoom: 1 }}
        minZoom={0.55}
        maxZoom={1.25}
        preventScrolling={false}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        onlyRenderVisibleElements={true}
        onnodeclick={selectNode}
        colorMode="dark"
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="var(--border-hover)" />
        <Controls showLock={false} />
      </SvelteFlow>
    {/key}
  </div>
</div>

{#if legendOpen}
  <aside class="fixed bottom-4 left-[max(16px,calc((100vw-var(--container-width))/2+16px))] top-[70px] z-45 flex w-[min(360px,calc(100vw-32px))] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-float max-md:inset-x-[10px] max-md:top-16 max-md:w-auto" aria-label="Пояснения к карте">
    <header class="flex items-start justify-between gap-5 border-b border-border p-5">
      <div><h2>Как читать карту</h2></div>
      <button class="grid size-8 place-items-center rounded-md border border-border bg-surface-muted text-xl text-muted hover:border-border-strong hover:text-foreground" type="button" aria-label="Закрыть пояснения" onclick={() => (legendOpen = false)}>×</button>
    </header>
    <div class="flex flex-1 flex-col overflow-y-auto p-5">
      <div class="grid text-sm text-content" aria-label="Легенда прогресса">
        <span class="grid grid-cols-[24px_1fr] items-center gap-x-2 border-b border-border py-4"><i class="size-2 rounded-full border-2 border-muted"></i><strong>Не начато</strong><small class="col-start-2 text-xs leading-5 text-muted">Упражнения ещё не выполнены</small></span>
        <span class="grid grid-cols-[24px_1fr] items-center gap-x-2 border-b border-border py-4"><i class="size-2 rounded-full border-2 border-warning"></i><strong>В процессе</strong><small class="col-start-2 text-xs leading-5 text-muted">Часть упражнений уже выполнена</small></span>
        <span class="grid grid-cols-[24px_1fr] items-center gap-x-2 border-b border-border py-4"><i class="size-2 rounded-full border-2 border-warning bg-warning"></i><strong>Завершено</strong><small class="col-start-2 text-xs leading-5 text-muted">Все упражнения выполнены</small></span>
        <span class="grid grid-cols-[24px_1fr] items-center gap-x-2 py-4"><i class="w-5 border-t-2 border-dashed border-muted"></i><strong>Необязательная связь</strong><small class="col-start-2 text-xs leading-5 text-muted">Навык полезен, но не обязателен для трека</small></span>
      </div>
    </div>
  </aside>
{:else if selectedSkill}
  <aside class="fixed bottom-4 right-[max(16px,calc((100vw-var(--container-width))/2+16px))] top-[70px] z-45 flex w-[min(360px,calc(100vw-32px))] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-float max-md:inset-x-[10px] max-md:top-16 max-md:w-auto" aria-label={`Навык: ${selectedSkill.title}`}>
    <header class="flex items-start justify-between gap-5 border-b border-border p-5">
      <div><h2 class="text-xl font-semibold text-foreground">{selectedSkill.title}</h2></div>
      <button class="grid size-8 place-items-center rounded-md border border-border bg-surface-muted text-xl text-muted hover:border-border-strong hover:text-foreground" type="button" aria-label="Закрыть описание" onclick={() => (selectedSkill = null)}>×</button>
    </header>
    <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
      <p class="text-sm leading-6 text-content">{selectedSkill.description}</p>
      {#if selectedSkill.exerciseIds.length}
        <p class="text-xs text-muted">Прогресс считается по решённым упражнениям Codenesis.</p>
      {:else if selectedSkill.kind === "internal"}
        <p class="rounded-md border border-border bg-card px-3 py-3 text-xs leading-5 text-muted">Программа уже доступна. Профильные упражнения добавляются отдельно, поэтому прогресс пока начинается с 0%.</p>
      {/if}
      {#if selectedSkill.kind === "external"}
        <a class="mt-auto flex min-h-13 items-center border-t border-border bg-surface-muted px-5 font-semibold text-foreground hover:bg-card" href={selectedSkill.href} target="_blank" rel="noreferrer">Открыть roadmap {selectedSkill.title} ↗</a>
      {:else}
        <a class="mt-auto flex min-h-13 items-center border-t border-border bg-surface-muted px-5 font-semibold text-foreground hover:bg-card" href={`#/roadmaps/${selectedSkill.roadmapId}`}>Перейти к курсу {selectedSkill.title} →</a>
      {/if}
    </div>
  </aside>
{:else if selectedRole}
  <aside class="fixed bottom-4 right-[max(16px,calc((100vw-var(--container-width))/2+16px))] top-[70px] z-45 flex w-[min(360px,calc(100vw-32px))] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-float max-md:inset-x-[10px] max-md:top-16 max-md:w-auto" aria-label={getRoleDisplayName(selectedRole.title)}>
    <header class="flex items-start justify-between gap-5 border-b border-border p-5">
      <div><h2 class="text-xl font-semibold text-foreground">{getRoleDisplayName(selectedRole.title)}</h2></div>
      <button class="grid size-8 place-items-center rounded-md border border-border bg-surface-muted text-xl text-muted hover:border-border-strong hover:text-foreground" type="button" aria-label="Закрыть описание" onclick={() => (selectedRole = null)}>×</button>
    </header>
    <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
      <p class="text-sm leading-6 text-content">{selectedRole.description}</p>
      <h3 class="text-xs font-semibold text-foreground">Общая база</h3>
      <div class="grid gap-2">
        {#each selectedRoleSkills as skill}
          <button class="grid min-h-11 grid-cols-[32px_1fr_auto] items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 text-left text-xs text-content hover:border-border-strong hover:bg-surface-muted" type="button" onclick={() => { selectedRole = null; selectedSkill = skill; }}>
            <span class="grid size-8 place-items-center rounded-md border border-border bg-background">
              <LanguageIcon language={skill.tone === "database" ? "database" : skill.tone} size={20} />
            </span>
            <span>{skill.title}</span>
            <small class="font-mono text-[10px] text-muted">{Math.round((progressBySkill.get(skill.id) ?? 0) * 100)}%</small>
          </button>
        {/each}
      </div>
      <button
        class={`mt-auto flex min-h-13 items-center border-t border-border px-5 text-left font-semibold text-foreground ${activeRoleId === selectedRole.id ? "bg-[linear-gradient(to_right,var(--error)_var(--hold-progress),var(--error-light)_var(--hold-progress))]" : "bg-surface-muted hover:bg-card"}`}
        style={`--hold-progress: ${holdProgress}%`}
        type="button"
        aria-label={activeRoleId === selectedRole.id ? "Зажмите, чтобы отменить трек" : "Выбрать трек"}
        onpointerdown={startCancelHold}
        onpointerup={() => stopCancelHold()}
        onpointercancel={() => stopCancelHold()}
        onpointerleave={() => stopCancelHold()}
        onkeydown={handleTrackKeyDown}
        onkeyup={handleTrackKeyUp}
        onclick={handleTrackAction}
      >{activeRoleId === selectedRole.id ? "Зажмите, чтобы отменить трек" : "Выбрать трек"}</button>
    </div>
  </aside>
{/if}
