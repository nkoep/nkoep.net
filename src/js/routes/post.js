import Route from "./route.js";
import { findPost } from "../post.js";

export default class PostRoute extends Route {
  async load(pathname) {
    const post = await findPost(pathname);
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
