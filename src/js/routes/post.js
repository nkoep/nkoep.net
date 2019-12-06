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
    const post = findPost(pathname);
    if (!post) {
      return this.generateError_("Post not found");
    }

    const content = await post.fetchContent();
    if (content === null) {
      return this.generateError_("Resource not found");
    }

    this.setTitle(post.title);
    return `
      <h1>${post.title}</h1>
      <p class="date">${post.date}</p>
      ${content}
    `;
  }
}
