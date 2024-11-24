<script lang="ts">
  import { faGithub, faLastfm } from "@fortawesome/free-brands-svg-icons";
  import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
  import Icon from "svelte-awesome/components/Icon.svelte";

  const socialPages = [
    { url: "https://github.com/nkoep/", icon: faGithub },
    { url: "https://last.fm/user/cRZYFST", icon: faLastfm },
    { url: "mailto:contact@nkoep.net", icon: faEnvelope },
  ];
</script>

<ul class="inline-list">
  {#each socialPages as page}
    <li>
      <a href={page.url} target="_blank"><Icon data={page.icon} /></a>
    </li>
  {/each}
</ul>

<style lang="scss">
  @use "./theme.scss";

  a {
    color: theme.$fg;

    &:hover {
      color: theme.$link;
    }
  }

  li {
    &:not(:last-child) {
      padding-right: theme.$item-spacing;
    }
  }
</style>
