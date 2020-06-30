<script>
	import Nav from "../components/Nav.svelte";

	export let segment;
</script>

<style lang="scss" global>
  @import "../style/global.scss";

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
</style>

<main>
  <Nav {segment}/>

  <div id="outlet">
    <slot></slot>
  </div>
</main>
