<script lang="ts">
  import { slide } from "svelte/transition";

  import Logo from "./Logo.svelte";
  import Navbar from "./Navbar.svelte";
  import Social from "./Social.svelte";
  import { showMenu } from "./stores.js";

  import Icon from "svelte-awesome/components/Icon.svelte";
  import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

  const validateCloseMenu = (event: KeyboardEvent) => {
    const { key } = event;
    if (key === "Escape" || key === "Esc") {
      event.preventDefault();
      $showMenu = false;
    }
  };
</script>

<svelte:window onkeyup={validateCloseMenu} />

<header>
  <div class="navbar">
    <Navbar />
  </div>

  <div class="logo">
    <Logo />
  </div>

  <div class="social">
    <Social />
  </div>

  <div class="menu-button">
    <button onclick={() => ($showMenu = !$showMenu)}>
      <Icon data={$showMenu ? faTimes : faBars} scale={1.5} />
    </button>
  </div>
</header>

{#if $showMenu}
  <div class="menu" transition:slide={{ duration: 300 }}>
    <Navbar />
    <Social />
  </div>
{/if}

<style lang="scss">
  @use "./theme.scss";

  header {
    display: flex;

    &::before {
      content: "";
      flex: 1 1 100%;

      @media (min-width: theme.$menu-breakpoint) {
        content: none;
      }
    }
  }

  .navbar,
  .social,
  .menu-button {
    display: flex;
    flex: 1 1 100%;
    margin: auto 0;

    @media (max-width: theme.$menu-breakpoint) {
      display: none;
    }
  }

  .social {
    justify-content: flex-end;
  }

  .menu-button {
    display: flex;

    @media (min-width: theme.$menu-breakpoint) {
      display: none;
    }

    &::before {
      content: "";
      flex: 1 1 100%;
    }
  }

  .menu {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
</style>
