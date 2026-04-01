<script lang="ts">
  import "@fontsource/cormorant";
  import "@fontsource/montserrat";
  import "@fontsource/nunito";
  import "@fontsource/raleway";

  import "normalize.css";
  import "katex/dist/katex.min.css";
  import "@catppuccin/highlightjs/css/catppuccin-frappe.css";
  import "./styles.scss";

  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/stores";

  import Header from "./Header.svelte";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  afterNavigate(({ type, to }) => {
    if (type === "enter") {
      if (to?.url.hash) {
        document
          .querySelector(to.url.hash)
          ?.scrollIntoView({ behavior: "instant" });
      }
      document.documentElement.style.visibility = "";
    }
  });

  let showContent = $state(true);
  let initialPageLoad = true;
  let currentPath = "";

  onMount(() => {
    return page.subscribe(($page) => {
      if (initialPageLoad) {
        initialPageLoad = false;
        currentPath = $page.url.pathname;
        return;
      }
      if ($page.url.pathname === currentPath) {
        return;
      }
      currentPath = $page.url.pathname;
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
      {@render children?.()}
    </div>
  {/if}
</main>
