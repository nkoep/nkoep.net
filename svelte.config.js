import katex from "@neilsustc/markdown-it-katex";
import adapter from "@sveltejs/adapter-static";
import autoprefixer from "autoprefixer";
import grayMatter from "gray-matter";
import hljs from "highlight.js";
import svelteHighlight from "highlightjs-svelte";
import markdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import footnotes from "markdown-it-footnote";
import toc from "markdown-it-table-of-contents";
import sveltePreprocess from "svelte-preprocess";

import macros from "./katex-macros.js";

svelteHighlight(hljs);

const highlight = (str, language) => {
  if (language && hljs.getLanguage(language)) {
    try {
      return (
        '<pre><code class="hljs">' +
        hljs.highlight(str, { language, ignoreIllegals: true }).value +
        "</code></pre>"
      );
    } catch (_) {
      // empty
    }
  }
  return "";
};

const markdownItProcessor = () => {
  const markdown = new markdownIt({
    html: true,
    highlight,
  })
    .use(toc, {
      containerClass: "table-of-contents",
      containerHeaderHtml: "<h2>Table of Contents</h2>",
      slugify: anchor.defaults.slugify,
    })
    .use(anchor, {
      permalink: anchor.permalink.linkInsideHeader({
        class: "icon-link",
        symbol: "#",
      }),
      slugify: anchor.defaults.slugify,
    })
    .use(footnotes)
    .use(katex, {
      macros,
      throwOnError: true,
    });

  // markdown-it automatically wraps the output of [[toc]] in a paragraph.
  // Since the content is a div (i.e., a block element), the svelte compiler
  // will throw an error since block elements are not allowed in p-tags.
  const unwrapTableOfContents = (html) => {
    const capture = html.match(/<p>(<div class="table-of-contents".*?)<\/p>/);
    if (capture === null) {
      return html;
    }
    const [pTag, pTagContent] = capture;
    return html.replace(pTag, pTagContent);
  };

  const processMarkdown = (content) => {
    const parsed = grayMatter(content);
    const rendered = unwrapTableOfContents(markdown.render(parsed.content))
      .replace(/^\t{3}/gm, "")
      .replace("`", "&#96;")
      .replace(/\t/g, "&#9;")
      .replace(/{/g, "&#123;")
      .replace(/}/g, "&#125;");

    const metadata = JSON.stringify(parsed.data);
    const scriptModule = `<script context="module">export const metadata = ${metadata};</script>`;
    return scriptModule + "\n" + rendered;
  };

  const markup = ({ content, filename }) => {
    if (filename.endsWith(".md")) {
      content = processMarkdown(content);
    }
    return {
      code: content,
    };
  };

  return { markup };
};

const preprocess = [
  markdownItProcessor(),
  sveltePreprocess({
    defaults: {
      style: "scss",
    },
    scss: {
      includePaths: ["src"],
      outputStyle: "compressed",
    },
    postcss: {
      plugins: [autoprefixer],
    },
  }),
];

const config = {
  extensions: [".svelte", ".md"],
  preprocess,
  kit: {
    adapter: adapter(),
  },
};

export default config;
