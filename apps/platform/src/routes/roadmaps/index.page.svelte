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
    skillTreeRoles,
    skillTreeSkills,
    optionalSkillTreeConnectionKeys,
    type SkillTreeRole,
    type SkillTreeSkill,
  } from "../../lib/roadmaps";

  const nodeTypes = { skillTree: SkillTreeNode };
  const edgeTypes = { floating: FloatingEdge };
  const rolePositions: Record<string, { x: number; y: number }> = {
    "fullstack-role": { x: 410, y: 10 },
    "frontend-role": { x: 100, y: 230 },
    "backend-role": { x: 430, y: 230 },
    "ml-role": { x: 760, y: 230 },
  };
  const skillPositions: Record<string, { x: number; y: number }> = {
    "html-skill": { x: 35, y: 445 },
    "css-skill": { x: 215, y: 445 },
    "javascript-skill": { x: 395, y: 445 },
    "python-skill": { x: 650, y: 445 },
    "databases-skill": { x: 830, y: 445 },
  };
  let routeHash = typeof window === "undefined" ? "" : window.location.hash;
  let selectedRole: SkillTreeRole | null = null;
  let selectedSkill: SkillTreeSkill | null = null;
  let legendOpen = false;
  let activeRoleId: string | null = null;
  let demoMode = false;
  let holdProgress = 0;
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
  $: nodes = [
    ...skillTreeRoles.map((role) => ({
      id: role.id,
      type: "skillTree",
      position: rolePositions[role.id],
      width: 220,
      height: 170,
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
    ...skillTreeSkills.map((skill) => ({
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
        hasSource: false,
      },
      draggable: true,
      connectable: false,
      deletable: false,
      ariaLabel: `Навык: ${skill.title}`,
    } satisfies SkillTreeFlowNode)),
  ];
  $: visualConnections = [
    { source: "fullstack-role", target: "frontend-role", tone: "#64748b" },
    { source: "fullstack-role", target: "backend-role", tone: "#64748b" },
    ...skillTreeConnections
      .filter((connection) => connection.roleId !== "fullstack-role")
      .map((connection) => {
        return {
          source: connection.roleId,
          target: connection.skillId,
          tone: "#64748b",
          optional: optionalSkillTreeConnectionKeys.has(`${connection.roleId}:${connection.skillId}`),
        };
      }),
  ];
  $: edges = visualConnections.map((connection) => {
    const edgeDimmed = Boolean(activeRoleId && connection.source !== activeRoleId);
    return {
      id: `${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      type: "floating",
      style: `stroke:#64748b;stroke-width:3;opacity:${edgeDimmed ? ".12" : ".72"}${connection.optional ? ";stroke-dasharray:7 6" : ""}`,
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
    activeRoleId = activeRoleId === role.id ? null : role.id;
    selectedRole = role;
    selectedSkill = null;
  }

  function startCancelHold() {
    if (!selectedRole || activeRoleId !== selectedRole.id) return;
    holdProgress = 0;
    cancelHoldInterval = setInterval(() => {
      holdProgress = Math.min(100, holdProgress + 100 / 900 * 30);
    }, 30);
    cancelHoldTimer = setTimeout(() => {
      activeRoleId = null;
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
    if (!selectedRole) return;
    if (activeRoleId === selectedRole.id) return;
    selectTrack(selectedRole);
  }

  onMount(() => {
    routeHash = window.location.hash;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        legendOpen = false;
        selectedRole = null;
        selectedSkill = null;
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  });
</script>

<svelte:window on:hashchange={() => (routeHash = window.location.hash)} />

<div class="container skill-tree-page">
  <header class="skill-tree-header">
    <h1>Skill tree</h1>
  </header>

  <div class="skill-tree-map" class:demo-mode={demoMode}>
    <button
      class="legend-trigger"
      class:active={legendOpen}
      type="button"
      aria-label="Открыть пояснения к карте"
      aria-expanded={legendOpen}
      onclick={() => {
        legendOpen = !legendOpen;
        selectedRole = null;
        selectedSkill = null;
      }}
    >Легенда</button>
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
      <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#28313d" />
      <Controls showLock={false} />
    </SvelteFlow>
  </div>
</div>

{#if legendOpen}
  <aside class="skill-sheet legend-sheet" aria-label="Пояснения к карте">
    <header class="skill-sheet-header">
      <div><h2>Как читать карту</h2></div>
      <button type="button" aria-label="Закрыть пояснения" onclick={() => (legendOpen = false)}>×</button>
    </header>
    <div class="skill-sheet-body legend-sheet-body">
      <div class="skill-tree-legend" aria-label="Легенда прогресса">
        <span><i class="legend-dot empty"></i><strong>Не начато</strong><small>Упражнения ещё не выполнены</small></span>
        <span><i class="legend-dot partial"></i><strong>В процессе</strong><small>Часть упражнений уже выполнена</small></span>
        <span><i class="legend-dot complete"></i><strong>Завершено</strong><small>Все упражнения выполнены</small></span>
        <span><i class="legend-line"></i><strong>Необязательная связь</strong><small>Навык полезен, но не обязателен для трека</small></span>
      </div>
    </div>
  </aside>
{:else if selectedSkill}
  <aside class="skill-sheet" aria-label={`Навык: ${selectedSkill.title}`}>
    <header class="skill-sheet-header">
      <div><span>Навык · {Math.round((progressBySkill.get(selectedSkill.id) ?? 0) * 100)}%</span><h2>{selectedSkill.title}</h2></div>
      <button type="button" aria-label="Закрыть описание" onclick={() => (selectedSkill = null)}>×</button>
    </header>
    <div class="skill-sheet-body">
      <p>{selectedSkill.description}</p>
      {#if selectedSkill.exerciseIds.length}
        <p class="skill-sheet-note">Прогресс считается по решённым упражнениям Codenesis.</p>
      {/if}
      {#if selectedSkill.kind === "external"}
        <a class="sheet-action" href={selectedSkill.href} target="_blank" rel="noreferrer">Открыть roadmap {selectedSkill.title} ↗</a>
      {:else}
        <a class="sheet-action" href={`#/roadmaps/${selectedSkill.roadmapId}`}>Перейти к курсу {selectedSkill.title} →</a>
      {/if}
    </div>
  </aside>
{:else if selectedRole}
  <aside class="skill-sheet" aria-label={getRoleDisplayName(selectedRole.title)}>
    <header class="skill-sheet-header">
      <div><h2>{getRoleDisplayName(selectedRole.title)}</h2></div>
      <button type="button" aria-label="Закрыть описание" onclick={() => (selectedRole = null)}>×</button>
    </header>
    <div class="skill-sheet-body">
      <p>{selectedRole.description}</p>
      <h3>Общая база</h3>
      <div class="role-skill-list">
        {#each selectedRoleSkills as skill}
          <button type="button" onclick={() => { selectedRole = null; selectedSkill = skill; }}>
            <span class={`role-skill-icon tone-${skill.tone}`}>
              <LanguageIcon language={skill.tone === "database" ? "database" : skill.tone} size={18} />
            </span>
            <span>{skill.title}</span>
            <small>{Math.round((progressBySkill.get(skill.id) ?? 0) * 100)}%</small>
          </button>
        {/each}
      </div>
      <button
        class:cancel-track={activeRoleId === selectedRole.id}
        class="sheet-action track-action"
        style={`--hold-progress: ${holdProgress}%`}
        type="button"
        aria-label={activeRoleId === selectedRole.id ? "Зажмите, чтобы отменить трек" : "Выбрать трек"}
        onpointerdown={startCancelHold}
        onpointerup={() => stopCancelHold()}
        onpointercancel={() => stopCancelHold()}
        onpointerleave={() => stopCancelHold()}
        onclick={handleTrackAction}
      >{activeRoleId === selectedRole.id ? "Зажмите, чтобы отменить трек" : "Выбрать трек"}</button>
    </div>
  </aside>
{/if}

<style>
  .skill-tree-page { padding-top: 34px; padding-bottom: 60px; }
  .skill-tree-header { margin-bottom: 22px; }
  h1 { margin: 0 0 8px; color: #f7f9fc; font-size: clamp(30px, 5vw, 48px); letter-spacing: -.05em; }
  .legend-trigger { position: absolute; z-index: 10; top: 16px; left: 16px; display: inline-flex; min-height: 34px; align-items: center; justify-content: center; padding: 0 13px; border: 1px solid #374253; border-radius: 9px; background: #11161e; color: #c5ceda; cursor: pointer; font: 600 11px/1 var(--font-mono); }
  .legend-trigger:hover, .legend-trigger.active { border-color: #74839a; background: #19212c; color: #fff; }
  .legend-trigger:focus-visible { outline: 2px solid #94a3b8; outline-offset: 2px; }
  .skill-tree-legend { display: grid; gap: 4px; color: #d8dee7; }
  .skill-tree-legend span { display: grid; grid-template-columns: 24px 1fr; align-items: center; gap: 4px 10px; padding: 14px 0; border-bottom: 1px solid #29313c; }
  .skill-tree-legend span:last-child { border-bottom: 0; }
  .skill-tree-legend strong { font-size: 13px; font-weight: 600; }
  .skill-tree-legend small { grid-column: 2; color: #8e99a8; font-size: 11px; line-height: 1.45; }
  .legend-dot { width: 9px; height: 9px; border: 2px solid #637287; border-radius: 50%; }
  .legend-dot.partial { border-color: #d7b83f; }
  .legend-dot.complete { border-color: #f4d35e; background: #f4d35e; }
  .skill-tree-map { position: relative; height: calc(100dvh - 210px); min-height: 500px; overflow: hidden; border: 1px solid #2a323e; border-radius: 14px; background: #0a0d11; }
  :global(.skill-tree-map .svelte-flow) { --xy-background-color: #0a0d11; --xy-controls-button-background-color: #151b24; --xy-controls-button-background-color-hover: #202938; --xy-controls-button-color: #b8c1ce; --xy-controls-button-border-color: #2d3744; --xy-minimap-background-color: #0d1117; }
  :global(.skill-tree-map .svelte-flow__attribution) { display: none; }
  :global(.skill-tree-map .svelte-flow__edge path) { stroke-linecap: round; stroke-width: 3; vector-effect: non-scaling-stroke; }
  :global(.skill-tree-map .svelte-flow__edge.animated-connection path) { stroke-dasharray: 5 9; filter: drop-shadow(0 0 3px rgb(148 163 184 / 28%)); animation: roadmap-edge-flow 1.35s linear infinite; }
  :global(.skill-tree-map .svelte-flow__edge.optional-connection path) { stroke-dasharray: 7 7; opacity: .65; }
  @keyframes roadmap-edge-flow { to { stroke-dashoffset: -28; } }
  @media (prefers-reduced-motion: reduce) { :global(.skill-tree-map .svelte-flow__edge.animated-connection path) { animation: none; } }
  .legend-line { width: 22px; border-top: 2px dashed #637287; }
  .skill-sheet { position: fixed; z-index: 45; top: 70px; right: max(16px, calc((100vw - 1200px) / 2 + 16px)); bottom: 16px; display: flex; width: min(360px, calc(100vw - 32px)); flex-direction: column; overflow: hidden; border: 1px solid #374253; border-radius: 14px; background: #11161e; box-shadow: 0 24px 70px rgba(0,0,0,.58); }
  .legend-sheet { right: auto; left: max(16px, calc((100vw - 1200px) / 2 + 16px)); }
  .legend-sheet-body { padding-bottom: 20px; }
  .skill-sheet-header { display: flex; align-items: start; justify-content: space-between; gap: 18px; padding: 20px; border-bottom: 1px solid #29313c; }
  .skill-sheet-header span { color: #aebfd9; font: 700 9px/1 var(--font-mono); letter-spacing: .12em; text-transform: uppercase; }
  .skill-sheet-header h2 { margin: 6px 0 0; color: #f2f5f8; font-size: 21px; }
  .skill-sheet-header button { display: grid; width: 30px; height: 30px; place-items: center; border: 1px solid #303946; border-radius: 7px; background: #171d26; color: #a9b1bd; font-size: 20px; cursor: pointer; }
  .skill-sheet-body { display: flex; min-height: 0; flex: 1; flex-direction: column; gap: 18px; overflow-y: auto; padding: 20px 20px 0; }
  .skill-sheet-body p { color: #b7c1ce; font-size: 13px; line-height: 1.55; }
  .skill-sheet-note { color: #7f8b9b !important; font-size: 11px !important; }
  .skill-sheet-body h3 { color: #e9edf2; font-size: 12px; }
  .role-skill-list { display: grid; gap: 7px; }
  .role-skill-list button { display: grid; grid-template-columns: 28px 1fr auto; align-items: center; gap: 9px; min-height: 42px; padding: 6px 9px; border: 1px solid #2c3542; border-radius: 8px; background: #151b24; color: #e3e8ef; cursor: pointer; font-size: 12px; text-align: left; }
  .role-skill-list button:hover { border-color: #9dbdff; background: #202b3b; }
  .role-skill-icon { display: grid; width: 30px; height: 30px; place-items: center; border: 1px solid var(--role-skill-tone); border-radius: 7px; background: var(--role-skill-tone); color: #fff; }
  .role-skill-icon :global(svg), .role-skill-icon :global(img) { display: block; width: 18px; height: 18px; filter: brightness(0) invert(1); }
  .role-skill-icon.tone-html { --role-skill-tone: #e44d26; }
  .role-skill-icon.tone-css { --role-skill-tone: #1572b6; }
  .role-skill-icon.tone-javascript { --role-skill-tone: #f7df1e; }
  .role-skill-icon.tone-python { --role-skill-tone: #3776ab; }
  .role-skill-icon.tone-database { --role-skill-tone: #64748b; }
  .role-skill-list small { color: #c7d3e1; font: 10px/1 var(--font-mono); }
  .skill-sheet-body .sheet-action { display: flex; min-height: 52px; align-items: center; margin: auto -20px 0; padding: 0 20px; border-top: 1px solid #2c3542; background: #19222e; color: #e3e8ef; font-weight: 600; text-decoration: none; }
  .skill-sheet-body .sheet-action:hover { background: #202b3b; color: #fff; }
  .skill-sheet-body .track-action { width: calc(100% + 40px); justify-content: flex-start; border-right: 0; border-bottom: 0; border-left: 0; cursor: pointer; font: 600 13px/1.2 inherit; }
  .skill-sheet-body .track-action.cancel-track { background: linear-gradient(to right, #b91c1c var(--hold-progress), #35191d var(--hold-progress)); color: #fff; }
  .skill-sheet-body .track-action.cancel-track:hover { background: linear-gradient(to right, #dc2626 var(--hold-progress), #35191d var(--hold-progress)); }
  @media (max-width: 720px) { .skill-tree-map { height: 650px; min-height: 0; margin-right: -12px; margin-left: -12px; } .skill-sheet { top: 64px; right: 10px; bottom: 10px; left: auto; width: calc(100vw - 20px); } .legend-sheet { right: auto; left: 10px; } }
</style>
