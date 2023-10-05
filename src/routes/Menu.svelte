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
  @import "../style/components/Header.scss";
  @import "../style/theme.scss";

  div {
    align-items: center;
    display: flex;
    flex-direction: column;
    font-size: $menu-fontsize;

    :global(li) {
      font-size: $menu-fontsize;
      margin: $item-spacing;
    }

    :global(nav),
    :global(ul) {
      align-items: center;
      display: flex;
      flex: 1 1 100%;
    }
  }
</style>
