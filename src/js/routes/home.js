import Route from "./route.js";
import getPosts from "../post.js";
import { convertMarkdown } from "../utils.js";

export default class HomeRoute extends Route {
  async load() {
    const div = document.createElement("div");
    div.id = "posts";

    const posts = await getPosts();

    [...posts].reverse().forEach(post => {
      const h1 = document.createElement("h1");
      h1.textContent = post.title;

      const p = document.createElement("p");
      p.className = "date";
      p.textContent = post.date;

      const item = document.createElement("a");
      item.className = "post link";
      item.href = `/post/${post.basename}`;
      [h1, p].forEach(element => item.appendChild(element));

      div.appendChild(item);
    });

    return div;
  }
}
