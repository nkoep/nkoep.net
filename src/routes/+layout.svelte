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
