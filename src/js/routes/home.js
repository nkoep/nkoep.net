import Route from "./route.js";
import { posts } from "../../posts.js";
import { convertMarkdown } from "../utils.js";

const pythonHead = `
\`\`\`python
>>> from nkoep.rnd import musings
>>> for year in sorted(musings.years())[::-1]:
...     print(f"{year}:")
...     for musing in musings.group_by_year(year)[::-1]:
...         print(musing)
...     print()
\`\`\`
`;

export default class HomeRoute extends Route {
  load() {
    const div = document.createElement("div");
    div.innerHTML = convertMarkdown(pythonHead);
    const code = div.querySelector("code");

    const appendHTML = html => code.insertAdjacentHTML("beforeend", html);
    const appendHljsTag = (klass, text) => {
      const span = document.createElement("span");
      span.className = `hljs-${klass}`;
      span.textContent = text;
      code.appendChild(span);
    };

    // Insert an ellipsis first since highlight.js doesn't properly highlight
    // continuation ellipses.
    appendHljsTag("meta", "...\n");

    let previousYear = null;
    // We assume posts are pre-sorted in increasing order, so we simply reverse
    // the order here when listing them on the landing page so that the most
    // recent post is on top.
    [...posts].reverse().forEach(post => {
      const year = post.date.year();
      if (year !== previousYear) {
        if (previousYear) {
          appendHTML("\n");
        }
        previousYear = year;
        appendHljsTag("number", year);
        appendHTML(":\n");
      }

      appendHTML("Musing(")
      appendHTML(`<a class="link hljs-string"
                     href="/post/${post.basename}">"${post.title}"</a>, `);
      appendHljsTag("string", `"${post.date}"`);
      appendHTML(")\n");
    });
    appendHTML("\n");

    return div;
  }
}
