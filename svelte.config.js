import adapter from "@sveltejs/adapter-static";
import autoprefixer from "autoprefixer";
import sveltePreprocess from "svelte-preprocess";

import frontMatter from "front-matter";
import hljs from "highlight.js";
import katex from "@neilsustc/markdown-it-katex";
import footnotes from "markdown-it-footnote";
import markdownIt from "markdown-it";
import headings from "markdown-it-github-headings";
import toc from "markdown-it-table-of-contents";

import macros from "./katex-macros.js";

const highlight = (str, language) => {
  if (language && hljs.getLanguage(language)) {
    try {
      return (
        '<pre><code class="hljs">' +
        hljs.highlight(str, { language, ignoreIllegals: true }).value +
        "</code></pre>"
      );
    } catch (_) { }
  }
  return "";
};

const markdownItProcessor = () => {
  const markdown = new markdownIt({
    highlight,
    linkify: true,
    html: true,
  })
    .use(katex, {
      macros,
      throwOnError: true,
    })
    .use(footnotes)
    .use(headings, {
      className: "icon-link",
      prefixHeadingIds: false,
      linkIcon: "#",
    })
    .use(toc, {
      containerHeaderHtml: "<h2>Table of Contents</div>",
    });

  const processMarkdown = (content) => {
    const postFrontMatter = frontMatter(content);
    const rendered = markdown
      .render(postFrontMatter.body)
      .replace(/^\t{3}/gm, "")
      .replace("`", "&#96;")
      .replace(/\t/g, "&#9;")
      .replace(/{/g, "&#123;")
      .replace(/}/g, "&#125;");

    const metadata = JSON.stringify(postFrontMatter.attributes);
    const scriptModule = `<script context="module">export const metadata = ${metadata};</script>`;
    return {
      code: scriptModule + "\n" + `\{@html \`${rendered}\`\}`,
    };
  };

  const markup = ({ content, filename }) => {
    if (!filename.endsWith(".md")) {
      return { code: content };
    }
    return processMarkdown(content);
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
