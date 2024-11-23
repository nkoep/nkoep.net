<script>
  import Logo from "./Logo.svelte";
  import Menu from "./Menu.svelte";
  import Navbar from "./Navbar.svelte";
  import Social from "./Social.svelte";
  import { showMenu } from "./stores.js";

  import Icon from "svelte-awesome/components/Icon.svelte";
  import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
</script>

<header>
  <div>
    <Navbar />
  </div>

  <Logo />

  <div>
    <Social />
  </div>

  <div id="menu-button">
    <button onclick={() => ($showMenu = !$showMenu)}>
      <Icon data={$showMenu ? faTimes : faBars} scale={1.5} />
    </button>
  </div>
</header>

<!-- TODO: Do this without a Menu component that wraps separate instances of
           Navbar + Social.
-->
{#if $showMenu}
  <div class="menu">
    <Menu />
  </div>
{/if}

<style lang="scss">
  @use "./theme.scss";

  div:not(.menu) {
    display: none;
    flex: 1 1 100%;
    margin: auto 0;

    @media only screen and (min-width: theme.$menu-breakpoint) {
      display: block;
    }
  }

  header {
    :global {
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      li {
        display: inline;
      }
    }

    display: flex;

    &::before {
      content: "";
      flex: 1 1 100%;

      @media only screen and (min-width: theme.$menu-breakpoint) {
        content: none;
      }
    }
  }

  header,
  .menu {
    :global {
      a,
      button {
        color: theme.$fg;

        &:hover {
          color: theme.$link;
        }
      }
    }
  }

  #menu-button {
    display: flex;

    @media only screen and (min-width: theme.$menu-breakpoint) {
      display: none;
    }

    &::before {
      content: "";
      flex: 1 1 100%;
    }
  }
</style>
