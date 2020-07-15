<script>
  import Icon from "svelte-awesome/components/Icon.svelte";
  import {
    faGithub,
    faInstagram,
    faLastfm,
    faTwitter
  } from "@fortawesome/free-brands-svg-icons";

  export let iconScale = 1;

  const socialPages = [
    { url: "https://github.com/nkoep/", icon: faGithub },
    { url: "https://instagram.com/polylith_", icon: faInstagram },
    { url: "https://twitter.com/spczf", icon: faTwitter },
    { url: "https://last.fm/user/cRZYFST", icon: faLastfm }
  ];
</script>

<style lang="scss">
  @import "../style/theme.scss";
  @import "../style/components/Header.scss";

  ul {
    text-align: right;
  }

  li {
    margin-left: $item-spacing;
    white-space: nowrap;
  }
</style>

<ul>
  {#each socialPages as page}
    <li><a href="{page.url}" target="_blank"><Icon data={page.icon} scale="{iconScale}"/></a></li>
  {/each}
</ul>
