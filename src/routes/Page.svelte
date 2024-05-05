<script>
  import { formatDate } from "../routes/helpers";

  export let body;
  export let title;
  export let date = null;
  export let header = null;
</script>

<svelte:head>
  <title>{title} | Niklas Koep</title>
</svelte:head>

{#if header}
  <img class="header" alt="header" src={header} />
{/if}

{#if title}
  <h1>{title}</h1>
  {#if date}
    <p class="date">{formatDate(date)}</p>
  {/if}
{/if}
<svelte:component this={body} />
