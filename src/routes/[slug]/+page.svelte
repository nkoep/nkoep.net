<script lang="ts">
  import Page from "../Page.svelte";

  let { data } = $props();
</script>

<Page {...data} />
