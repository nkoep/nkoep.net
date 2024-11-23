<script>
  import { page } from "$app/stores";
  import { showMenu } from "./stores.js";

  $: currentPage = $page.params.page;

  const pages = ["about", "projects"];
</script>

<nav>
  <ul>
    {#each pages as page}
      <li>
        <a
          on:click={() => ($showMenu = false)}
          aria-current={page === currentPage ? true : undefined}
          href="/{page}">{page}</a
        >
      </li>
    {/each}
  </ul>
</nav>

<style lang="scss">
  @use "./theme.scss";

  [aria-current],
  [aria-current]::after {
    font-weight: bold;
  }

  nav {
    font-family: "Montserrat", sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 1.5px;
    text-align: left;
    text-transform: uppercase;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: inline;
    margin-right: theme.$item-spacing;
  }
</style>
