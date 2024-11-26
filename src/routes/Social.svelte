<script lang="ts">
  import Envelope from "virtual:icons/la/envelope";
  import Github from "virtual:icons/la/github";
  import Lastfm from "virtual:icons/la/lastfm";

  const socialPages = [
    { url: "https://github.com/nkoep/", Icon: Github },
    { url: "https://last.fm/user/cRZYFST", Icon: Lastfm },
    { url: "mailto:contact@nkoep.net", Icon: Envelope },
  ];
</script>

<ul class="inline-list">
  {#each socialPages as page}
    <li>
      <a href={page.url} target="_blank"><page.Icon /></a>
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
