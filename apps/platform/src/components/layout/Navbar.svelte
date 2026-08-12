<script lang="ts">
  import { onMount } from "svelte";
  import { logout } from "../../lib/auth-client";

  export let pathname = "/";
  export let onLogout: () => void = () => {};
  let menuOpen = false;
  let profileOpen = false;
  const navItems = [
    { label: "Главная", to: "#/" },
    { label: "Roadmaps", to: "#/roadmaps" },
    { label: "Задачи", to: "#/challenges" },
  ];

  async function handleLogout() {
    await logout();
    closeMenus();
    window.location.hash = "/";
    onLogout();
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
        <button type="button" class="nav-profile-button" aria-expanded={profileOpen} aria-label="Открыть меню профиля" on:click={() => (profileOpen = !profileOpen)}><span>K</span></button>
        <div id="profile-navigation" class:is-open={profileOpen} class="profile-dropdown">
          <a href="#/profile" class="profile-dropdown-item" on:click={closeMenus}><span>◉</span><span>Профиль</span></a>
          <a href="#/settings" class="profile-dropdown-item" on:click={closeMenus}><span>⚙</span><span>Настройки</span></a>
          <button type="button" class="profile-dropdown-item" on:click={handleLogout}><span>↪</span><span>Выйти</span></button>
        </div>
      </div>
      <button type="button" class="nav-menu-button" aria-expanded={menuOpen} aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} on:click={() => (menuOpen = !menuOpen)}>{menuOpen ? "×" : "☰"}</button>
    </div>
  </div>
</nav>
