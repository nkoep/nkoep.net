<script>
  import { page } from "$app/stores";

  let currentPage = $derived($page.params.slug);
  const pages = ["about", "projects"];
</script>

<nav>
  <ul class="inline-list">
    {#each pages as page}
      <li>
        <a
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

  a {
    color: theme.$fg;

    &:hover {
      color: theme.$link;
    }
  }

  nav {
    font-family: "Montserrat", sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 1.5px;
    text-align: left;
    text-transform: uppercase;
  }

  li {
    &:not(:first-child) {
      padding-left: theme.$item-spacing;
    }
  }
</style>
