<script lang="ts">
  import type { PageProps } from "$lib/types";

  import Page from "../../Page.svelte";

  let { data }: { data: PageProps } = $props();
</script>

<Page {...data} />
