<script>
  import { onDestroy, onMount } from "svelte";
  import { slide } from "svelte/transition";

  import Icon from "svelte-awesome/components/Icon.svelte";
  import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

  import { showMenu } from "../stores.js";
  import Navbar from "./Navbar.svelte";
  import Social from "./Social.svelte";

  export let segment;

  onMount(() => {
    onDestroy(showMenu.subscribe(value => {
      const html = document.querySelector("html");
      if (value) {
        html.style.overflowY = "hidden";
      } else {
        html.style.overflowY = "unset";
      }
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

  div {
    display: flex;
    flex: 1 1 100%;
    justify-content: right;
  }

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
  }

  #menu-button,
  #close-button {
    font-size: $menubutton-fontsize;
  }

  .menu {
    align-items: center;
    background-color: $bg;//$fg;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-x: hidden;
    position: fixed;
    right: 0;
    top: 0;
    transition: width 250ms;
    width: 100%;
    z-index: 1;

    a {
      color: #ffc937;
      color: $link;
    }

    a:hover {
      color: $link-hover;
    }

    nav li {
      display: block;
    }

    nav,
    .social {
      font-size: $menu-fontsize;
    }

    #close-button,
    nav,
    .social {
      align-items: center;
      display: flex;
      justify-content: center;

      li {
        margin: $item-spacing;
        text-align: center;
      }
    }

    #close-button,
    nav {
      border-bottom: solid 1px rgba($fg, 0.25);
      width: 35%;
    }
  }
</style>

<svelte:window on:keyup|preventDefault={validateCloseMenu}/>

<div id="menu-button">
  <button on:click={() => $showMenu = true}><Icon data={faBars} scale="1.25"/></button>
</div>

{#if $showMenu}
  <div class="menu" transition:slide>
    <button on:click={() => $showMenu = false}><Icon data={faTimes} scale="1.25"/></button>
    <Navbar forceShow={true} {segment}/>
    <Social forceShow={true}/>
  </div>
{/if}
