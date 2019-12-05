import Route from "./route.js";
import { posts } from "../../posts.js";
import { convertMarkdown } from "../utils.js";

const pythonRepl = posts => `
\`\`\`python
>>> from nkoep.rnd import musings
>>> for year in sorted(musings.years())[::-1]:
...     print(f"{year}:")
...     for musing in musings.group_by_year(year):
...         print(musing)
...     print()
...
${posts}
\`\`\`
`;

export default class HomeRoute extends Route {
  load() {
    var div = document.createElement("div");

    // TODO: Actually filter posts by year.
    const entries = ["2019:"];
    [...posts].reverse().forEach(post => {
      entries.push(`Musing("${post.title}", "${post.date}")`);
    });

    const getPostUrl = title => {
      // XXX: This is ugly.
      title = title.slice(1, title.length-1);
      for (let i = 0; i < posts.length; ++i) {
        const post = posts[i];
        if (title === post.title) {
          return `/post/${post.basename}`;
        }
      }
    };

    div.innerHTML = convertMarkdown(pythonRepl(entries.join("\n")));
    const labels = Array.from(div.getElementsByClassName("hljs-string"));
    // This is so very fucking ugly, but oh well :D
    // We skip the first element, cause that's the year f-string, and then
    // every other element with the hljs-string class should be a post name,
    // which we'll turn into an anchor tag by wrapping the span element. Also,
    // the way we retrieve the
    for (let i = 1; i < labels.length; i += 2) {
      const label = labels[i];
      // const newLabel = label.cloneNode(true);
      const a = document.createElement("a");
      a.className = "link hljs-string";
      a.style.fontWeight = "bold";
      a.textContent = label.textContent;
      // XXX: This approach has O(n^2) complexity...
      a.href = getPostUrl(label.textContent);
      label.parentNode.replaceChild(a, label);
    }

    return div;
  }
}
