<script lang="ts">
  import type { PageProps } from "$lib/types";

  import { formatDate } from "../routes/helpers";

  let { body, title, date = null, header = null }: PageProps = $props();

  const SvelteComponent = $derived(body);
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
<SvelteComponent />
