<script>
  export let header = null;
  export let title = null;
  export let date = null;
</script>

<svelte:head>
  <title>{title} | Niklas Koep</title>
</svelte:head>

{#if header !== null}
  <img alt="header" src={header} />
{/if}

{#if title !== null}
  <h1>{title}</h1>
  {#if date !== null}
    <p class="date">{date}</p>
  {/if}
{/if}

<slot />

<style lang="scss">
  @import "../style/theme.scss";

  h1,
  p.date {
    text-align: center;
  }

  img {
    display: block;
    margin: 0 auto;
    width: 40%;
  }
</style>
