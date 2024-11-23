<script>
  import { page } from "$app/stores";
</script>

{#if $page.error !== null}
  <h1>{$page.error.message}</h1>
{/if}
