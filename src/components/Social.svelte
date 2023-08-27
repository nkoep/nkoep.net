<script>
  import Icon from "svelte-awesome/components/Icon.svelte";
  import {
    faGithub,
    faInstagram,
    faLastfm,
  } from "@fortawesome/free-brands-svg-icons";
  import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

  export let iconScale = 1;

  const socialPages = [
    { url: "https://github.com/nkoep/", icon: faGithub },
    { url: "https://instagram.com/polylith_", icon: faInstagram },
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
