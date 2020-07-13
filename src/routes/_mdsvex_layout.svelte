<script>
  export let title;
  export let header = null;
</script>

<svelte:head>
  <title>{title} | Niklas Koep</title>
</svelte:head>

<style>
  img {
    display: block;
    margin: 0 auto;
    width: 40%;
  }
</style>

{#if header}
  <img alt="header" src={header}>
{/if}

<h1>{title}</h1>

<slot></slot>
