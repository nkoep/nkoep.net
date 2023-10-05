<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  import "@fontsource/montserrat";
  import "@fontsource/raleway";
  import "@fontsource/nunito";
  import "@fontsource/cormorant";
  import "highlight.js/styles/paraiso-light.css";

  import Header from "./Header.svelte";
  import Menu from "./Menu.svelte";
  import { showMenu } from "./stores.js";

  let show = true;
  let initialPageLoad = true;

  onMount(() => {
    return page.subscribe(() => {
      if (initialPageLoad) {
        initialPageLoad = false;
        return;
      }
      $showMenu = false;
      show = false;
      setTimeout(() => {
        show = true;
      }, 0);
    });
  });
</script>

<main>
  <Header />

  {#if $showMenu}
    <div class="small-screen">
      <Menu />
    </div>
  {/if}

  {#if show}
    <div id="outlet" in:fade={{ duration: 650 }}>
      <slot />
    </div>
  {/if}
</main>

<style lang="scss" global>
  @import "../style/theme.scss";
  @import "../style/video.scss";

  * {
    box-sizing: border-box;

    &:focus {
      -webkit-tap-highlight-color: transparent;
    }
  }

  html {
    margin: auto;
    // Hack to avoid content from being repositioned when the scrollbar
    // appears.
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
      min-width: 40%;
    }
  }

  img.header {
    display: block;
    margin: 0 auto;
    width: 40%;
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
    font-size: 1.05em;
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
    color: rgba($fg-muted, 0.75);
    font-style: italic;
    margin: 0;
    margin-top: -0.5em;
    padding: 0;
    padding-bottom: 1em;
  }

  h1,
  p.date {
    text-align: center;
  }

  main {
    margin: auto;
    max-width: 700px;
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

  .hljs {
    background-color: rgba($fg-muted, 0.02);
  }

  h1,
  h2,
  h3 {
    .icon-link {
      $offset: 1em;

      display: block;
      float: left;
      margin-left: -$offset;
      opacity: 0;
      transition: 250ms;
      width: $offset;
    }

    &:hover .icon-link {
      opacity: 1;
      transition: 100ms;
    }
  }

  // Hack to hide anchor tags on page headings.
  h1 .icon-link,
  #table-of-contents .icon-link {
    display: none;
  }

  .small-screen {
    @media only screen and (min-width: $menu-breakpoint) {
      display: none;
    }
  }
</style>
