import Route from "./route.js";
import { posts } from "../../posts.js";

function findPost(pathname) {
  const matches = pathname.match(/^\/post\/(.*)/);
  if (!matches) {
    return null;
  }
  const basename = matches[1];
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
