<script>
  export let title;
</script>

<svelte:head>
  <title>{title} | Niklas Koep</title>
</svelte:head>

<h1>{title}</h1>

<slot></slot>
