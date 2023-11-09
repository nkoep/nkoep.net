<script>
  export let body, title, date, header;
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
    <p class="date">{date}</p>
  {/if}
{/if}
<svelte:component this={body} />
