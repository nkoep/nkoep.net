<script>
  import Icon from "svelte-awesome/components/Icon.svelte";
  import {
    faGithub, faInstagram, faTwitter , faLastfm
  } from "@fortawesome/free-brands-svg-icons"

	export let segment;

  const pages = ["about", "misc"];
  const socialPages = [
    { id: "github", url: "https://github.com/nkoep/", icon: faGithub },
    { id: "instagram", url: "https://instagram.com/polylith_", icon: faInstagram },
    { id: "twitter", url: "https://twitter.com/spczf", icon: faTwitter },
    { id: "lastfm", url: "https://last.fm/user/cRZYFST", icon: faLastfm }
  ];
</script>

<style lang="scss">
  @import "../style/theme.scss";

  [aria-current],
  [aria-current]::after {
    .active {
      font-weight: bold;
    }
	}

	/* [aria-current]::after { */
	/* 	position: absolute; */
	/* 	content: ''; */
	/* 	width: calc(100% - 1em); */
	/* 	height: 2px; */
	/* 	background-color: rgb(255,62,0); */
	/* 	display: block; */
	/* 	bottom: -1px; */
	/* } */

  #header {
    $item-spacing: 1.5em;
    $menu-breakpoint: 575px;
    $menubutton-fontsize: 24px;
    $menu-fontsize: 20px;

    display: flex;

    a {
      color: black;
    }

    a:hover {
      color: $link;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        display: inline;
      }
    }

    &::before {
      content: "";
      @media only screen and (min-width: $menu-breakpoint) {
        content: none;
      }
    }

    &::before,
    .navbar,
    #logo,
    .social,
    #menu-button,
    #close-button {
      flex: 1 1 100%;
    }

    .navbar,
    .social {
      display: none;
      margin: auto 0;

      @media only screen and (min-width: $menu-breakpoint) {
        display: block;
      }
    }

    .navbar {
      font-family: "Montserrat", sans-serif;
      font-size: 11px;
      font-weight: 400;
      letter-spacing: 1.5px;
      text-align: left;
      text-transform: uppercase;

      li {
        margin-right: $item-spacing;
        text-align: left;
      }
    }

    #logo {
      font-family: "Cormorant", serif;
      font-size: 40px;
      text-align: center;
    }

    .social {
      text-align: right;

      li {
        margin-left: $item-spacing;
        white-space: nowrap;
      }
    }

    #menu-button,
    #close-button {
      font-size: $menubutton-fontsize;
    }

    #menu-button {
      margin: auto 0;
      text-align: right;

      @media only screen and (min-width: $menu-breakpoint) {
        display: none;
      }
    }

    .menu {
      align-items: center;
      background: $fg;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-x: hidden;
      position: fixed;
      right: 0;
      top: 0;
      transition: width 250ms;
      width: 0;
      z-index: 1;

      a {
        color: #ffc937;
        color: $link;
      }

      a:hover {
        color: $link-hover;
      }

      .navbar li {
        display: block;
      }

      .navbar,
      .social {
        font-size: $menu-fontsize;
      }

      #close-button,
      .navbar,
      .social {
        align-items: center;
        display: flex;
        justify-content: center;

        li {
          margin: $item-spacing;
          text-align: center;
        }
      }

      #close-button,
      .navbar {
        border-bottom: solid 1px rgba($fg, 0.25);
        width: 35%;
      }
    }

    .menu-open {
      width: 100%;
    }
  }
</style>

<div id="header">
  <!-- <Menu />-->

  <nav class="navbar">
    <ul>
      {#each pages as page}
        <li><a aria-current="{segment === page ? segment : undefined}" href="{page}">{page}</a></li>
      {/each}
    </ul>
  </nav>

  <div id="logo">
    <a href="/">NK</a>
  </div>

  <ul class="social">
    {#each socialPages as page (page.id)}
      <li><a href="{page.url}" target="_blank"><Icon data={page.icon}/></a></li>
    {/each}
  </ul>
</div>
