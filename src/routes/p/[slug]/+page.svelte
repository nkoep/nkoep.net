<script lang="ts">
  import Page from "../../Page.svelte";
  import type { PageProps } from "$lib/types";

  let { data }: { data: PageProps } = $props();
</script>

<Page {...data} />
