import Route from "./route.js";

export default class Post extends Route {
  load(pathname) {
    console.log(window.location, pathname)
    const span = document.createElement("span");
    span.style.color = "blue";
    span.textContent = "todo";
    return span;

    // We don't explicitly check if pathname begins with
    // "/articles" since the regex match should have taken
    // care of this.
    const name = pathname.split("/articles", 1)[1];
    // const content = await utils.fetchPost(name + ".md");

    // TODO: Use element.scrollIntoView if we can find an id with the given
    //       hash.
    const hash = window.location.hash;
  }
}
