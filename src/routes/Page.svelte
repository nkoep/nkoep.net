<script lang="ts">
  import { formatDate } from "../routes/helpers";

  interface Props {
    body;
    title: string;
    date?: string | null;
    header?: string | null;
  }

  let { body, title, date = null, header = null }: Props = $props();

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
