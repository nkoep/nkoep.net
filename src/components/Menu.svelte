<script>
  import { onDestroy, onMount } from "svelte";
  import { slide } from "svelte/transition";

  import Icon from "svelte-awesome/components/Icon.svelte";
  import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

  import Navbar from "./Navbar.svelte";
  import Social from "./Social.svelte";
  import { showMenu } from "../stores.js";

  export let segment;

  onMount(() => {
    onDestroy(showMenu.subscribe(value => {
      const html = document.querySelector("html");
      html.style.overflowY = value ? "hidden" : "unset";
    }));
  });

  const validateCloseMenu = event => {
    const key = event.key;
    if (key === "Escape" || key === "Esc") {
      $showMenu = false;
    }
  };
</script>

<style lang="scss">
  @import "../style/theme.scss";
  @import "../style/components/Header.scss";

  button {
    background: none;
    border: none;

    &:hover,
    &:active {
      cursor: pointer;
    }
  }

  #menu-button {
    @media only screen and (min-width: $menu-breakpoint) {
      display: none;
    }

    display: flex;
    flex: 1 1 100%;
    justify-content: right;
  }

  #menu {
    align-items: center;
    background-color: $fg;
    display: flex;
    flex-direction: column;
    font-size: $menu-fontsize;
    height: calc(100%);
    overflow-x: hidden;
    position: fixed;
    right: 0;
    top: 0;
    transition: width 250ms;
    width: 100%;
    z-index: 1;

    :global(li) {
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

    #close-button {
      flex: 1 1 100%;
    }

    #close-button,
    :global(nav),
    :global(ul) {
      align-items: center;
      display: flex;
      justify-content: center;
    }

    :global(nav li) {
      font-size: $menu-fontsize;
    }
  }
</style>

<svelte:window on:keyup|preventDefault={validateCloseMenu}/>

<div id="menu-button">
  <button on:click={() => $showMenu = true}><Icon data={faBars} scale="1.25"/></button>
</div>

{#if $showMenu}
  <div id="menu" transition:slide={{duration: 300}}>
    <div id="close-button">
      <button on:click={() => $showMenu = false}><Icon data={faTimes} scale="1.5"/></button>
    </div>
    <Navbar overlayMenu={true} {segment}/>
    <Social overlayMenu={true}/>
  </div>
{/if}
