import katex from "@neilsustc/markdown-it-katex";
import adapter from "@sveltejs/adapter-static";
import autoprefixer from "autoprefixer";
import grayMatter from "gray-matter";
import hljs from "highlight.js";
import markdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import footnotes from "markdown-it-footnote";
import toc from "markdown-it-table-of-contents";
import sveltePreprocess from "svelte-preprocess";

import macros from "./katex-macros.js";

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
      containerHeaderHtml: "<h2>Table of Contents</div>",
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
  const processMarkdown = (content) => {
    const frontMatter = grayMatter(content);
    const rendered = markdown
      .render(frontMatter.content)
      .replace(/^\t{3}/gm, "")
      .replace("`", "&#96;")
      .replace(/\t/g, "&#9;")
      .replace(/{/g, "&#123;")
      .replace(/}/g, "&#125;");

    const metadata = JSON.stringify(frontMatter.data);
    const scriptModule = `<script context="module">export const metadata = ${metadata};</script>`;
    return scriptModule + "\n" + `{@html \`${rendered}\`}`;
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
