<script>
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  import Icon from "svelte-awesome/components/Icon.svelte";
  import { faTimes } from "@fortawesome/free-solid-svg-icons";

  import Navbar from "./Navbar.svelte";
  import Social from "./Social.svelte";
  import { showMenu } from "../stores.js";

  export let segment;

  onMount(() => {
    showMenu.subscribe(value => {
      const html = document.querySelector("html");
      html.style.overflowY = value ? "hidden" : "unset";
    });
  });

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

  #menu-button {
    @media only screen and (min-width: $menu-breakpoint) {
      display: none;
    }

    &::before {
      content: "";
      flex: 1 1 100%;
    }

    display: flex;
    flex: 1 1 100%;
  }

  #close-button {
    flex: 1 1 100%;
  }

  #menu {
    align-items: center;
    background-color: $fg;
    display: flex;
    flex-direction: column;
    font-size: $menu-fontsize;
    height: 100vh;
    left: 0;
    overflow-x: hidden;
    padding: 2em 0;
    position: fixed;
    top: 0;
    transition: width 250ms;
    width: 100%;
    z-index: 1;

    :global(li) {
      font-size: $menu-fontsize;
      margin: $item-spacing;
    }

    button,
    :global(a) {
      color: rgba($bg, 0.9);
    }

    button:hover,
    :global(a:hover) {
      color: $link-hover;
    }

    #close-button,
    :global(nav),
    :global(ul) {
      align-items: center;
      display: flex;
      flex: 1 1 100%;
    }
  }
</style>

<svelte:window on:keyup|preventDefault={validateCloseMenu}/>

<div id="menu" transition:slide={{duration: 300}}>
  <div id="close-button">
    <button on:click={() => $showMenu = false}>
      <Icon data={faTimes} scale="1.5"/>
    </button>
  </div>
  <Navbar {segment}/>
  <Social iconScale={1.5}/>
</div>
