<script lang="ts">
  import Icon from "svelte-awesome/components/Icon.svelte";
  import { faGithub, faLastfm } from "@fortawesome/free-brands-svg-icons";
  import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

  interface Props {
    iconScale?: number;
  }

  let { iconScale = 1 }: Props = $props();

  const socialPages = [
    { url: "https://github.com/nkoep/", icon: faGithub },
    { url: "https://last.fm/user/cRZYFST", icon: faLastfm },
    { url: "mailto:contact@nkoep.net", icon: faEnvelope },
  ];
</script>

<ul>
  {#each socialPages as page}
    <li>
      <a href={page.url} target="_blank"
        ><Icon data={page.icon} scale={iconScale} /></a
      >
    </li>
  {/each}
</ul>

<style lang="scss">
  @use "./theme.scss";

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    text-align: right;
  }

  li {
    display: inline;
    margin-left: theme.$item-spacing;
    white-space: nowrap;
  }
</style>
