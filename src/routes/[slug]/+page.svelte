<script>
  export let data;

  const { body, title, header } = data;
</script>

<svelte:head>
  <title>{title} | Niklas Koep</title>
</svelte:head>

{#if header}
  <img class="header" alt="header" src={header} />
{/if}

{#if title}
  <h1>{title}</h1>
{/if}
<svelte:component this={body} />
