<script lang="ts">
  import { formatDate } from "../routes/helpers";

  let { data } = $props();

  type Post = { title: string; date: string; slug: string };

  const postsByYear = $derived(
    data.posts.reduce(
      (acc: Record<number, Post[]>, post: Post) => {
        const year = new Date(post.date).getFullYear();
        (acc[year] ??= []).push(post);
        return acc;
      },
      {} as Record<number, Post[]>,
    ),
  );

  const years = $derived(
    Object.keys(postsByYear)
      .map(Number)
      .sort((a, b) => b - a),
  );
</script>

<svelte:head>
  <title>Niklas Koep</title>
</svelte:head>

<div>
  {#each years as year}
    <p class="year">{year}</p>
    {#each postsByYear[year] as post}
      <a class="post" data-sveltekit-preload-data href="p/{post.slug}">
        <span class="title">{post.title}</span>
        <span class="date">{formatDate(post.date)}</span>
      </a>
    {/each}
  {/each}
</div>

<style lang="scss">
  @use "./theme.scss";

  .year {
    color: theme.$link;
    font-family: "Montserrat", sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 1.5px;
    margin: 1.5em 0 0.25em;
    text-transform: uppercase;
  }

  .post {
    border-left: solid 2px transparent;
    display: block;
    padding: 0.3em theme.$inner-padding;
    transition:
      background-color 250ms,
      border-color 250ms;

    .title,
    .date {
      display: block;
      pointer-events: none;
      transform: translateX(0);
      transition: transform 250ms;
    }

    .title {
      font-family: "Raleway", sans-serif;
      font-size: 1em;
    }

    .date {
      color: rgba(theme.$fg-muted, 0.6);
      font-size: 0.8em;
      font-style: italic;
    }

    @media (hover: hover) {
      &:hover {
        background-color: rgba(theme.$fg-muted, 0.07);
        border-left-color: rgba(theme.$fg-muted, 0.25);
        transition:
          background-color 100ms,
          border-color 100ms;

        .title,
        .date {
          transform: translateX(theme.$inner-padding);
          transition: transform 100ms;
        }
      }
    }
  }
</style>
