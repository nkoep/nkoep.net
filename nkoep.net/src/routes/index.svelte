<script context="module">
	export async function preload({ params, query }) {
    const response = await this.fetch("p.json");
    const posts = await response.json();
    return { posts };
	}
</script>

<script>
	export let posts;
</script>

<style lang="scss">
  @import "./style/theme.scss";

  div {
    h1,
    p {
      margin: 0;
      padding: 0;
      pointer-events: none;
    }

    h1 {
      font-size: 1.25em;
    }

    .post {
      border: solid 0px transparent;
      display: block;
      margin: 1em 0;
      padding: $inner-padding;
      transition: 250ms;

      &:hover,
      &:active {
        background-color: rgba($fg-muted, 0.1);
        border-left: solid 3px rgba($fg-muted, 0.25);
        padding-left: 2 * $inner-padding;
      }
    }
  }
</style>

<svelte:head>
	<title>Niklas Koep</title>
</svelte:head>

<div>
	{#each posts as post}
    <a class="post" rel="prefetch" href="p/{post.slug}">
      <h1>{post.title}</h1>
      <p class="date">{post.date}</p>
    </a>
	{/each}
</div>
