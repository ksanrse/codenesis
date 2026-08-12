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

  const closeMenus = () => {
    menuOpen = false;
    profileOpen = false;
  };

  onMount(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeMenus();
    const onResize = () => window.innerWidth > 720 && (menuOpen = false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  });
</script>

<nav class="navbar" aria-label="Основная навигация">
  <div class:nav-inner-editor={pathname.startsWith("/challenges/")} class="nav-inner">
    <a href="#/" class="nav-logo" aria-label="Codenesis" on:click={closeMenus}>Codenesis</a>
    <div id="primary-navigation" class:nav-links-open={menuOpen} class="nav-links">
      {#each navItems as item}
        {@const path = item.to.slice(1) || "/"}
        <a href={item.to} class:active={path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`)} class="nav-link" on:click={closeMenus}>{item.label}</a>
      {/each}
    </div>
    <div class="nav-right">
      <div class="nav-profile-menu">
        <button type="button" class:developer-avatar={isDeveloper} class="nav-profile-button" aria-expanded={profileOpen} aria-label={isDeveloper ? "Открыть меню developer" : "Открыть меню профиля"} on:click={() => (profileOpen = !profileOpen)}><span>{isDeveloper ? "DEV" : "K"}</span></button>
        <div id="profile-navigation" class:is-open={profileOpen} class="profile-dropdown">
          <a href="#/profile" class="profile-dropdown-item" on:click={closeMenus}><span class="profile-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5"/></svg></span><span>Профиль</span></a>
          <a href="#/settings" class="profile-dropdown-item" on:click={closeMenus}><span class="profile-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="3.5"/></svg></span><span>Настройки</span></a>
          <button type="button" class="profile-dropdown-item" on:click={handleLogout}><span class="profile-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10"/></svg></span><span>Выйти</span></button>
        </div>
      </div>
      <button type="button" class="nav-menu-button" aria-expanded={menuOpen} aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} on:click={() => (menuOpen = !menuOpen)}>{menuOpen ? "×" : "☰"}</button>
    </div>
  </div>
</nav>
