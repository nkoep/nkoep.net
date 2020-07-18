<script>
  import Logo from "./Logo.svelte";
  import Navbar from "./Navbar.svelte";
  import Social from "./Social.svelte";
  import { showMenu } from "../stores.js";

  import Icon from "svelte-awesome/components/Icon.svelte";
  import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

	export let segment;
</script>

<style lang="scss">
  @import "../style/theme.scss";
  @import "../style/components/Header.scss";

  div {
    display: none;
    flex: 1 1 100%;
    margin: auto 0;

    @media only screen and (min-width: $menu-breakpoint) {
      display: block;
    }
  }

  header {
    display: flex;

    &::before {
      content: "";
      flex: 1 1 100%;

      @media only screen and (min-width: $menu-breakpoint) {
        content: none;
      }
    }
  }

  #menu-button {
    display: flex;

    @media only screen and (min-width: $menu-breakpoint) {
      display: none;
    }

    &::before {
      content: "";
      flex: 1 1 100%;
    }
  }
</style>

<header>
  <div>
    <Navbar {segment}/>
  </div>

  <Logo/>

  <div>
    <Social/>
  </div>

  <div id="menu-button">
    <button on:click={() => $showMenu = !$showMenu}>
      <Icon data={$showMenu ? faTimes : faBars} scale="1.25"/>
    </button>
  </div>
</header>
