<script>
  import "@fontsource/cormorant";
  import "@fontsource/montserrat";
  import "@fontsource/nunito";
  import "@fontsource/raleway";

  import "normalize.css";
  import "katex/dist/katex.min.css";
  import "highlight.js/styles/paraiso-light.css";
  import "./styles.scss";

  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  import Header from "./Header.svelte";

  let showContent = true;
  let initialPageLoad = true;

  onMount(() => {
    return page.subscribe(() => {
      if (initialPageLoad) {
        initialPageLoad = false;
        return;
      }
      showContent = false;
      setTimeout(() => {
        showContent = true;
      }, 0);
    });
  });
</script>

<main>
  <Header />

  {#if showContent}
    <div id="outlet" in:fade={{ duration: 650 }}>
      <slot />
    </div>
  {/if}
</main>
