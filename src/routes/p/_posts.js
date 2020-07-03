const frontMatter = require("front-matter");
const fs = require("fs");
var hljs = require("highlight.js")
const markdownIt = require("markdown-it");

const highlight = (str, language) => {
    if (language && hljs.getLanguage(language)) {
      try {
        return (
          "<pre><code class=\"hljs\">" +
          hljs.highlight(language, str, true).value +
          "</code></pre>"
        )
      } catch (__) {}
    }
    return "";
};
const markdown = markdownIt({highlight})

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
