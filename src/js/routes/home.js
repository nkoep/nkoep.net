import Route from "./route.js";
import { posts } from "../../posts.js";

export default class Home extends Route {
  load() {
    var ul = document.createElement("ul");
    ul.id = "posts";

    [...posts].reverse().forEach(function(post) {
      var a = document.createElement("a");
      a.className = "link";
      a.href = "/post/" + post.filename;
      a.textContent = post.name + " (" + post.date + ")";

      var li = document.createElement("li");
      li.appendChild(a);
      ul.appendChild(li);
    });

    return ul;
  }
}
