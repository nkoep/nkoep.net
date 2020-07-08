<script>
  import { fade } from "svelte/transition";
  import { afterUpdate, onMount } from "svelte";
  import { stores } from "@sapper/app";

	import Header from "../components/Header.svelte";

	export let segment;

  let show = true;
  const { page } = stores();

  onMount(() => {
    return page.subscribe(() => {
      show = false;
      setTimeout(() => show = true, 0);
    });
  });

  afterUpdate(() => {
    document.querySelectorAll("a").forEach(a => {
      console.log(a.hostname, window.location.hostname);
      if (a.hostname !== window.location.hostname) {
        return;
      }
      console.log(a);
      if (!a.hash || !document.querySelectorAll(a.hash).length) {
        return;
      }
      a.href = window.location.origin + window.location.pathname + a.hash;
      console.log(a);
    });
  });
</script>

<style lang="scss" global>
  @import "../style/theme.scss";
  @import "../style/video.scss";

  * {
    box-sizing: border-box;
  }

  html {
    margin: auto;
    // Hack to avoid content from being repositioned when the scrollbar appears.
    margin-right: calc(100% - 100vw);
    overflow-x: hidden;
  }

  body {
    background: $bg;
    color: $fg;
    font-family: "Nunito", sans-serif;
    font-size: 16px;
    line-height: 1.5;
    margin: 2em auto;
  }

  p {
    text-align: justify;

    > img {
      display: block;
      margin: 0 auto;
      max-width: 100%;
    }
  }

  h1,
  h2,
  h3 {
    font-family: "Raleway", sans-serif;
    line-height: 1.25;
    margin-top: 1.5em;
  }

  h1 {
    font-size: 1.5em;
  }

  h2 {
    font-size: 1.35em;
  }

  h3,
  summary {
    font-size: 1.15em;
  }

  code {
    font-size: 12px;
  }

  blockquote {
    background-color: rgba($fg-muted, 0.02);
    border-left: solid 3px rgba($link, 0.75);
    font-style: italic;
    color: rgba($fg, 0.75);
    margin: 1em 0;
    padding: $inner-padding;
    padding-left: 2 * $inner-padding;
    transition: 250ms;

    p {
      margin: 0;
      padding: 0;
    }

    &:active,
    &:hover {
      background-color: rgba($fg-muted, 0.1);
      border-left: solid 3px rgba($fg-muted, 0.25);
      padding-left: 2.5 * $inner-padding;
    }

    cite {
      font-style: normal;
    }
  }

  ul {
    list-style-position: outside;
    list-style-type: circle;
    padding: 0;
    padding-left: 2.5em;
  }

  button {
    margin: 0;
    padding: 0;

    &:focus {
      outline: 0;
    }
  }

  a {
    color: $link;
    text-decoration: none;
    transition: color 250ms;

    &:hover {
      color: $link-hover;
      transition: color 100ms;
    }
  }

  a:active,
  a:focus,
  summary {
    outline: none;
  }

  summary {
    font-weight: bold;
  }

  summary:hover {
    cursor: pointer;
  }

  p.date {
    color: $fg-muted;
    font-style: italic;
    margin: 0;
    margin-top: -0.5em;
    padding: 0;
    padding-bottom: 1em;
  }

  main {
    margin: auto;
    max-width: 750px;
    width: 85%;

    #outlet {
      padding-top: 1.5em;

      ul {
        font-size: 14px;
      }
    }
  }

  .katex-display {
    overflow-x: auto;
    overflow-y: hidden;
  }
</style>

<main>
  <Header {segment}/>

  {#if show}
    <div id="outlet" in:fade={{duration: 650}}>
      <slot></slot>
    </div>
  {/if}
</main>
