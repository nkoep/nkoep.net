<script lang="ts">
  export let title: string;
  export let id: string;
</script>

<div>
  <iframe
    src={`https://www.youtube.com/embed/${id}`}
    {title}
    frameborder="0"
    allowfullscreen
  />
</div>

<style lang="scss">
  div {
    margin: 1em 0;
    padding-bottom: 56.25%; // 16:9
    position: relative;

    iframe[src*="youtube.com"] {
      height: 100%;
      position: absolute;
      width: 100%;
    }
  }
</style>
