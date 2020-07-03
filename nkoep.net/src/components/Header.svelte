<script>
  import Navbar from "./Navbar.svelte";
  import Logo from "./Logo.svelte";
  import Social from "./Social.svelte";
  import Menu from "./Menu.svelte";

	export let segment;
</script>

<style lang="scss">
  @import "../style/theme.scss";
  @import "../style/components/Header.scss";

  div {
    display: flex;

    &::before {
      content: "";
      @media only screen and (min-width: $menu-breakpoint) {
        content: none;
      }
    }

    &::before,
    #logo {
      flex: 1 1 100%;
    }
  }

  #menu-button,
  #close-button {
    font-size: $menubutton-fontsize;
  }
</style>

<div>
  <Navbar {segment}/>
  <Logo/>
  <Social/>
  <Menu {segment}/>
</div>
