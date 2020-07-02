<script>
  import Social from "./Social.svelte";

  let open = false;

  const toggleMenu = () => {
    open = !open;
  };

  const validateCloseMenu = event => {
    const key = event.key;
    if (key === "Escape" || key === "Esc") {
      open = false;
    }
  };
</script>

<style>
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

    nav li {
      display: block;
    }

    nav,
    .social {
      font-size: $menu-fontsize;
    }

    #close-button,
    nav,
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
    nav {
      border-bottom: solid 1px rgba($fg, 0.25);
      width: 35%;
    }
  }

  .menu-open {
    width: 100%;
  }
</style>

<svelte:window on:keyup={validateCloseMenu|preventDefault}/>

{#if open}
  <div>
    <div>
      <span class="fas fa-times">
        <a href="javascript:void(0)" on:click={() => {open = false}}</a>
      </span>
    </div>

    <Social/>
  </div>
{:else}
  <div>
    <span class="fas fa-bar">
      <a href="javascript:void(0)" on:click={() => {open = true}}</a>
    </span>
  </div>
{/if}
