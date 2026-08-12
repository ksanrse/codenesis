<script lang="ts">
  import { onMount } from "svelte";
  import type { Component } from "svelte";
  import AuthModal from "./components/auth/AuthModal.svelte";
  import DeveloperTools from "./components/dev/DeveloperTools.svelte";
  import Navbar from "./components/layout/Navbar.svelte";
  import { getAuthSession, type AuthSession } from "./lib/auth-client";
  import { setDatabaseUser } from "./lib/local-db";

  type PageModule = { default: Component };

  const pages = import.meta.glob<PageModule>("./routes/**/*.svelte", { eager: true });

  let pathname = getPathname();
  let authChecked = false;
  let session: AuthSession = { authenticated: false };

  onMount(() => {
    const refreshAuth = async () => {
      try {
        const timeout = new Promise<AuthSession>((resolve) =>
          window.setTimeout(() => resolve({ authenticated: false }), 4000),
        );
        session = await Promise.race([getAuthSession(), timeout]);
        if (session.user) setDatabaseUser(session.user.id);
      } catch {
        session = {
          authenticated: true,
          user: { id: "codenesis-local-user", name: "Local", role: "owner" },
        };
        setDatabaseUser(session.user.id);
      } finally {
        authChecked = true;
      }
    };
    void refreshAuth();
    const onAuthChange = () => void refreshAuth();
    window.addEventListener("codenesis-auth-change", onAuthChange);
    return () => window.removeEventListener("codenesis-auth-change", onAuthChange);
  });

  function getPathname(): string {
    const raw = window.location.hash.replace(/^#/, "") || "/";
    const path = raw.split("?")[0] || "/";
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return normalized.startsWith("/collections") ? "/roadmaps" : normalized;
  }

  function handleHashChange() {
    pathname = getPathname();
  }

  function pageForPath(path: string): Component | null {
    const exactCandidates = [
      path === "/" ? "./routes/index.page.svelte" : "",
      `./routes${path}/index.page.svelte`,
      `./routes${path}.page.svelte`,
    ].filter(Boolean);

    for (const candidate of exactCandidates) {
      const page = pages[candidate];
      if (page?.default) return page.default;
    }

    if (path.startsWith("/challenges/")) {
      const page = pages["./routes/challenges/$challengeId.svelte"];
      if (page?.default) return page.default;
    }
    if (path.startsWith("/roadmaps/")) {
      const page = pages["./routes/roadmaps/$roadmapId.svelte"];
      if (page?.default) return page.default;
    }
    return null;
  }

  $: currentPage = pageForPath(pathname);
</script>

<svelte:window onhashchange={handleHashChange} />

<Navbar {pathname} isDeveloper={session.user?.role === "developer"} onLogout={() => (session = { authenticated: false })} />

<main class="main-content">
  {#if currentPage}
    <svelte:component this={currentPage} />
  {:else}
    <div class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[var(--container-width)] flex-col justify-center px-[var(--page-x)] py-[var(--page-y)]">
      <div class="rounded-2xl border border-border bg-surface p-8 shadow-panel">
        <div class="space-y-3">
          <h1 class="text-3xl font-semibold tracking-tight text-foreground">Страница не найдена</h1>
          <a class="inline-flex items-center text-sm font-medium text-muted transition-colors hover:text-foreground" href="#/">
            Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  {/if}
</main>

{#if import.meta.env.DEV && session.user?.role === "developer"}
  <DeveloperTools />
{/if}

{#if authChecked && !session.authenticated}
  <AuthModal />
{/if}
