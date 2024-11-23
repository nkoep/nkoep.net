<script>
  import { slide } from "svelte/transition";

  import Navbar from "./Navbar.svelte";
  import Social from "./Social.svelte";
  import { showMenu } from "./stores.js";

  const validateCloseMenu = (event) => {
    const { key } = event;
    if (key === "Escape" || key === "Esc") {
      $showMenu = false;
    }
  };
</script>

<svelte:window on:keyup|preventDefault={validateCloseMenu} />

<div transition:slide={{ duration: 300 }}>
  <Navbar />
  <Social iconScale={1.5} />
</div>

<style lang="scss">
  @use "./theme.scss";

  div {
    align-items: center;
    display: flex;
    flex-direction: column;
    font-size: theme.$menu-fontsize;

    @media only screen and (min-width: theme.$menu-breakpoint) {
      display: none;
    }

    :global {
      li {
        font-size: theme.$menu-fontsize;
        margin: theme.$item-spacing;
      }

      nav,
      ul {
        align-items: center;
        display: flex;
        flex: 1 1 100%;
      }
    }
  }
</style>
