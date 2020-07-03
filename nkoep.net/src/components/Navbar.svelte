<script>
  import { showMenu } from "../stores.js";

  export let segment;
  export let forceVisible = false;

  const pages = ["about", "misc"];
</script>

<style lang="scss">
  @import "../style/theme.scss";
  @import "../style/components/Header.scss";

  [aria-current],
  [aria-current]::after {
    font-weight: bold;
	}

  nav {
    flex: 1 1 100%;
    font-family: "Montserrat", sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 1.5px;
    text-align: left;
    text-transform: uppercase;
  }

  li {
    margin-right: $item-spacing;
  }
</style>

<nav class={forceVisible ? undefined : "menu-breakpoint"}>
  <ul>
    {#each pages as page}
      <li><a on:click={() => $showMenu = false} aria-current={segment === page ? segment : undefined} href="{page}">{page}</a></li>
    {/each}
  </ul>
</nav>
