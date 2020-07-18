<script>
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  import Navbar from "./Navbar.svelte";
  import Social from "./Social.svelte";
  import { showMenu } from "../stores.js";

  export let segment;

  /* onMount(() => { */
  /*   showMenu.subscribe(value => { */
  /*     const html = document.querySelector("html"); */
  /*     html.style.overflowY = value ? "hidden" : "unset"; */
  /*   }); */
  /* }); */

  const validateCloseMenu = event => {
    const key = event.key;
    if (key === "Escape" || key === "Esc") {
      $showMenu = false;
    }
  };
</script>

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

<svelte:window on:keyup|preventDefault={validateCloseMenu}/>

<div transition:slide={{duration: 300}}>
  <Navbar {segment}/>
  <Social iconScale={1.5}/>
</div>
