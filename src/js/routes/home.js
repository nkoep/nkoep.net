import Route from "./route.js";
import { posts } from "../../posts.js";

export default class HomeRoute extends Route {
  load() {
    var ul = document.createElement("ul");
    ul.id = "posts";

    [...posts].reverse().forEach(function(post) {
      var a = document.createElement("a");
      a.className = "link";
      a.href = "/post/" + post.basename;
      a.textContent = post.title + " (" + post.date + ")";

      var li = document.createElement("li");
      li.appendChild(a);
      ul.appendChild(li);
    });

    return ul;
  }
}
