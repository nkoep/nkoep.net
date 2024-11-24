<div>
  <a href="/">NK</a>
</div>

<style lang="scss">
  @use "./theme.scss";

  div {
    font-family: "Cormorant", serif;
    font-size: 40px;
    margin: auto 0;
    text-align: center;
  }

  a {
    color: theme.$fg;
    display: inline-block;
    padding: 0.1em 0;
    position: relative;
    text-decoration: none;

    &::after {
      background-color: theme.$link;
      bottom: 0;
      content: "";
      height: 2px;
      left: 0;
      position: absolute;
      transform-origin: right;
      transform: scaleX(0);
      transition: transform 250ms;
      width: 100%;
    }

    &:hover,
    &:active {
      &::after {
        transform: scaleX(1);
        transform-origin: left;
      }
    }
  }
</style>
