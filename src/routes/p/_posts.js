import frontMatter from "front-matter";
import fs from "fs";
import hljs from "highlight.js";
import katex from "@neilsustc/markdown-it-katex";
import markdownIt from "markdown-it";

import macros from "./_katex-macros.js";

const highlight = (str, language) => {
    if (language && hljs.getLanguage(language)) {
      try {
        return (
          "<pre><code class=\"hljs\">" +
          hljs.highlight(language, str, true).value +
          "</code></pre>"
        )
      } catch (_) {}
    }
    return "";
};

const markdown = (new markdownIt({
  highlight,
  linkify: true
})).use(katex, {
  macros,
  throwOnError: true
});

const posts = fs.readdirSync("./posts").map(postFilename => {
  const postContent = fs.readFileSync(`./posts/${postFilename}`, {
    encoding: "utf8"
  });
  const postFrontMatter = frontMatter(postContent);
  return {
    title: postFrontMatter.attributes.title,
    date: postFrontMatter.attributes.date,
    slug: postFrontMatter.attributes.slug,
    html: markdown.render(postFrontMatter.body)
  }
});
posts.sort((post1, post2) => new Date(post2.date) - new Date(post1.date));
posts.forEach(post => {
  post.html = post.html.replace(/^\t{3}/gm, "");
});

export default posts;
