<script lang="ts">
  import { onMount } from "svelte";
  import { logout } from "../../lib/auth-client";

  export let pathname = "/";
  export let onLogout: () => void = () => {};
  export let isDeveloper = false;

  let menuOpen = false;
  let profileOpen = false;

  const navItems = [
    { label: "Главная", to: "#/" },
    { label: "Roadmaps", to: "#/roadmaps" },
    { label: "Задачи", to: "#/challenges" },
  ];

  const closeMenus = () => {
    menuOpen = false;
    profileOpen = false;
  };

  const navLinkClass = (active: boolean) =>
    `inline-flex min-h-9 items-center rounded-full px-4 text-xs font-medium transition ${
      active
        ? "bg-surface text-foreground shadow-[inset_0_0_0_1px_var(--border)]"
        : "text-muted hover:bg-surface hover:text-foreground"
    }`;

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Local UI must still leave the authenticated state when the API is unavailable.
    } finally {
      closeMenus();
      window.location.hash = "/";
      onLogout();
    }
  }

  onMount(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeMenus();
    const onResize = () => window.innerWidth > 768 && (menuOpen = false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  });
</script>

<nav class="sticky top-0 z-60 border-b border-border/70 bg-background/85 backdrop-blur-xl" aria-label="Основная навигация">
  <div class="relative mx-auto flex min-h-[60px] w-full max-w-[var(--container-width)] items-center gap-4 px-[var(--page-x)]">
    <a href="#/" class="shrink-0 text-sm font-semibold tracking-[-0.01em] text-foreground transition hover:text-content" aria-label="Codenesis" on:click={closeMenus}>
      Codenesis
    </a>

    <div class={`absolute left-[var(--page-x)] right-[var(--page-x)] top-[calc(100%+8px)] z-50 ${menuOpen ? "flex" : "hidden"} flex-col gap-1 rounded-xl border border-border bg-surface p-2 shadow-float md:static md:mx-auto md:flex md:flex-row md:items-center md:justify-center md:gap-1 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
      {#each navItems as item}
        {@const path = item.to.slice(1) || "/"}
        <a href={item.to} class={navLinkClass(path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`))} on:click={closeMenus}>
          {item.label}
        </a>
      {/each}
    </div>

    <div class="ml-auto flex items-center gap-2">
      <div class="relative">
        <button
          type="button"
          class="grid size-10 place-items-center rounded-full border border-border text-xs font-extrabold text-foreground shadow-[0_8px_18px_rgb(0_0_0_/_28%)] transition hover:-translate-y-px hover:border-border-strong"
          style:background={isDeveloper ? "radial-gradient(circle at 30% 30%, #93c5fd, #334155 70%)" : "radial-gradient(circle at 30% 30%, #7a9ae8, #2b3342 70%)"}
          aria-expanded={profileOpen}
          aria-label={isDeveloper ? "Открыть меню developer" : "Открыть меню профиля"}
          on:click={() => (profileOpen = !profileOpen)}
        >
          <span>{isDeveloper ? "DEV" : "K"}</span>
        </button>

        {#if profileOpen}
          <div id="profile-navigation" class="absolute right-0 top-[calc(100%+10px)] z-70 min-w-52 overflow-hidden rounded-2xl border border-border bg-background p-1 shadow-float">
            <a href="#/profile" class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-surface hover:text-foreground" on:click={closeMenus}>
              <span class="grid size-4 place-items-center text-info" aria-hidden="true">
                <svg class="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5" />
                </svg>
              </span>
              <span>Профиль</span>
            </a>
            <a href="#/settings" class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-surface hover:text-foreground" on:click={closeMenus}>
              <span class="grid size-4 place-items-center text-info" aria-hidden="true">
                <svg class="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
                  <circle cx="12" cy="12" r="3.5" />
                </svg>
              </span>
              <span>Настройки</span>
            </a>
            <button type="button" class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-muted transition hover:bg-surface hover:text-foreground" on:click={handleLogout}>
              <span class="grid size-4 place-items-center text-info" aria-hidden="true">
                <svg class="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10" />
                </svg>
              </span>
              <span>Выйти</span>
            </button>
          </div>
        {/if}
      </div>

      <button
        type="button"
        class="grid size-10 place-items-center rounded-[10px] border border-border bg-surface text-[18px] text-content transition hover:border-border-strong hover:bg-surface-muted md:hidden"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        on:click={() => (menuOpen = !menuOpen)}
      >
        {menuOpen ? "×" : "☰"}
      </button>
    </div>
  </div>
</nav>
