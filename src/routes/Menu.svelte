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
  @import "./theme.scss";

  div {
    @media only screen and (min-width: $menu-breakpoint) {
      display: none;
    }

    align-items: center;
    display: flex;
    flex-direction: column;
    font-size: var(--menu-fontsize);

    :global {
      li {
        font-size: var(--menu-fontsize);
        margin: var(--item-spacing);
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
