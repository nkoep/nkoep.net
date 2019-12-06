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

function hljsSpanTag(klass, text) {
  const span = document.createElement("span");
  span.className = `hljs-${klass}`;
  span.textContent = text;
  return span;
}

export default class HomeRoute extends Route {
  load() {
    const div = document.createElement("div");
    div.innerHTML = convertMarkdown(pythonHead);
    const code = div.querySelector("code");

    // Insert an ellipsis first. highlight.js doesn't properly highlight
    // continuation ellipses.
    code.appendChild(hljsSpanTag("meta", "...\n"));

    let previousYear = null;
    // We assume posts are pre-sorted in increasing order, so we simply reverse
    // the order here when listing them on the landing page so that the most
    // recent post is on top.
    [...posts].reverse().forEach(post => {
      const year = post.date.year();
      if (year !== previousYear) {
        if (previousYear) {
          code.insertAdjacentHTML("beforeend", "\n");
        }
        previousYear = year;
        code.appendChild(hljsSpanTag("number", year));
        code.insertAdjacentHTML("beforeend", ":\n");
      }

      code.appendChild(document.createTextNode("Musing("))
      code.insertAdjacentHTML(
        "beforeend",
        `<a class="link hljs-string"
            href="/post/${post.basename}">"${post.title}"</a>, `);
      code.appendChild(hljsSpanTag("string", `"${post.date}"`));
      code.insertAdjacentHTML("beforeend", ")\n");
    });
    code.insertAdjacentHTML("beforeend", "\n");

    return div;
  }
}
