import Route from "./route.js";
import { posts } from "../../posts.js";

function findPost(pathname) {
  // We don't explicitly check if pathname begins with "/post" since the regex
  // match should have taken care of this.
  const basename = pathname.split("/post/", 2)[1];
  for (let i = 0; i < posts.length; ++i) {
    const post = posts[i];
    if (basename === post.basename) {
      return post;
    }
  }
  return null;
}

export default class PostRoute extends Route {
  async load(pathname) {
    const span = document.createElement("span");

    const post = findPost(pathname);
    if (!post) {
      // TODO: Fix this up a bit.
      span.style.color = "red";
      span.textContent = "Post not found";
      return span;
    }

    const content = await post.fetchContent();
    return `
      <h1>${post.title}</h1>
      <h2>${post.date}</h2>
      ${content}
    `;

    // TODO: Use element.scrollIntoView if we can find an id with the given
    //       hash.
    const hash = window.location.hash;
  }
}
