<script context="module">
  export async function preload({ params, query }) {
    const res = await this.fetch(`p/${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return {post: data};
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  export let post;

  import "highlight.js/styles/paraiso-light.css";
</script>

<style lang="scss">
  @import "../../style/theme.scss";

  :global(.hljs) {
    background-color: rgba($fg-muted, 0.02);
  }
</style>

<svelte:head>
  <title>{post.title} | Niklas Koep</title>
</svelte:head>

<h1>{post.title}</h1>
<p class="date">{post.date}</p>

<div class="content">
  {@html post.html}
</div>
