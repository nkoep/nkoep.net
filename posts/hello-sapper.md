---
title: Hello Sapper
date: August 16, 2020
slug: hello-sapper
---

## Introduction

The original version of this site was written as a hand-rolled framework-less
single-page app with a custom router managing the low-level details of the
[History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API).
This choice was mostly motivated by the desire to see what goes into writing a
client-side JS-based router.
Admittedly, my implementation suffered from a few annoying shortcomings as well
as some outright silly design decisions.
One example of such poor design was my insistence on serving pages as Markdown
files that were rendered on the client rather than serving pre-compiled HTML
files.
Moreover, since every page was served dynamically, every request to the site
had to be redirected to the index page serving as the site's entry point.
This meant, however, that the site could not return proper 404 status codes if
an unknown URL was hit.
Sadly, those weren't the only issues with the site, which is why a few months
ago I eventually decided to rewrite it in a more seasoned frontend framework.

Enter [Sapper](https://sapper.svelte.dev/), which is to
[Svelte](https://svelte.dev/) what Next.js is to React and what Nuxt.js is to
Vue.js.
I had long been interested in playing around with Svelte, and rewriting my
personal site in Sapper was a natural opportunity to finally try it out.
In short, Svelte is not just another component framework like React or Vue.js
but an optimizing compiler.
While most frameworks do the heavy lifting inside their respective virtual DOM
implementation running in the browser, Svelte performs a lot of this work
offline as part of the compilation step.
This allows for some rather unique features like true first-class
[reactivity](https://svelte.dev/blog/svelte-3-rethinking-reactivity), and
generally results in less code and lower bundle sizes.
[This](https://www.youtube.com/watch?v=AdNJ3fydeao) already classic talk by
Svelte's creator Rich Harris introduces the main ideas behind the project.

Sapper takes Svelte to its natural conclusion, and provides a framework to
author web apps with out-of-the-box support for code-splitting as well as
server-side rendering (SSR) that does not compromise on SEO.
Instead of listing all of Sapper's neat features, I'll simply refer interested
readers to its introductory blog
[post](https://svelte.dev/blog/sapper-towards-the-ideal-web-app-framework).
While there are some concepts in Svelte and Sapper that take a little getting
used to, the overall developer experience is incredibly refreshing.
However, I encountered a few issues along the way that seemed a little less
straightforward to resolve than I had hoped for or anticipated.
In this blog post, I therefore want to address 3 of those rough edges and
present the way I resolved them in the end.

## Markdown Pages

The first and most crucial feature I was missing out-of-the-box after checking
out the [Sapper template](https://github.com/sveltejs/sapper-template) was the
lack of support for Markdown pages.
Now in a way this shouldn't come as a surprise; in Sapper each page is simply
assumed to be a Svelte component.
I can appreciate this approach for regular pages of a site (i.e., any file in
`src/routes` not prefixed with and underscore and ending in `.svelte`).
However, this convention doesn't extend to blog posts, which in the Sapper
template are defined as inline HTML strings in `src/routes/blog/_posts.js`.
Since it's really not too much fun to write regular content pages or blog posts
in plain HTML (or Svelte components for that matter), we make the following
changes.

### Blog Posts

```javascript
import frontMatter from "front-matter";
import fs from "fs";
import markdownIt from "markdown-it";

const markdown = new markdownIt();
const posts = fs.readdirSync("./posts").map(postFilename => {
  const postContent = fs.readFileSync(`./posts/${postFilename}`, {
    encoding: "utf8"
  });
  const postFrontMatter = frontMatter(postContent);
  const { title, date, slug } = postFrontMatter.attributes;
  const html = markdown.render(postFrontMatter.body);
  return {title, date, slug, html};
});
posts.sort((post1, post2) => new Date(post2.date) - new Date(post1.date));
posts.forEach(post => {
  post.html = post.html.replace(/^\t{3}/gm, "");
});

export default posts;
```

### Regular Pages

While looking around for a solution to the first issue, I naturally came across
MDsveX which allows you to write Svelte components in Markdown in the spirit of
[MDX](https://mdxjs.com/) for JSX in Markdown.
Even though I don't have many regular pages on this site, I still preferred to
write those pages in Markdown.
While there's a Sapper starter
[template](https://github.com/pngwn/sapper-mdsvex-template) with MDsveX
support, setting it up manually with the regular Sapper template isn't too
complicated either.

To get started, we add MDsveX to the dev dependencies.

```shell
$ yarn add -D mdsvex
```

Then in the `rollup.config.js` file, we import the package and pass it to
the `svelte` function as part of the preprocessing step of both the client and
server configuration.
We also have to make sure to update the `extensions` variable so that Svelte
doesn't ignore files ending in `.md`.

```js
import * as fs from "fs";
// ...
import { mdsvex } from "mdsvex";

const preprocess = mdsvex({
  extension: ".md"
});

export default {
  client: {
    // ...
    plugins: [
      // ...
      svelte({
        dev,
        hydratable: true,
        emitCss: true,
        extensions: [".svelte", ".md"],
        preprocess
      })
    ],
    // ...
  },

  server: {
    // ...
    plugins: [
      json(),
      svelte({
        generate: "ssr",
        dev,
        extensions: [".svelte", ".md"],
        preprocess
      }),
      // ...
    ],
    // ...
  }
};
```

After making these changes I was surprised to see that things were still not
working as expected.
There weren't any errors, but none of my MDsveX components appeared in the
generated bundle.
This is because in addition to telling Svelte to process `.md` files in our
rollup config, we also have to tell Sapper to respect Markdown files when it is
invoked.
To that end, we have to pass the option `--ext '.svelte .md'` to every
invocation of the `sapper` utility inside
[our](https://github.com/nkoep/nkoep.net/blob/acf400cbaad2b7f56aca9024848a93bb99be2554/package.json#L6)
`package.json` file.
With these changes any Markdown file in the `src/routes` directory ending in
`.md` will first be converted to a regular Svelte component before being passed
on to the Sapper pipeline.

## Hydration of Internal Links

```svelte
<script>
  import { afterUpdate } from "svelte";

  afterUpdate(() => {
    document.querySelectorAll("a").forEach(a => {
      if (a.hostname !== window.location.hostname) {
        return;
      }
      if (!a.hash || !document.querySelectorAll(a.hash).length) {
        return;
      }
      a.href = window.location.origin + window.location.pathname + a.hash;
    });
  });
</script>
```

## Page Transitions

```svelte
<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";

  export let segment;

  let show = true;
  let initialPageLoad = true;
  const { page } = stores();

  onMount(() => {
    return page.subscribe(() => {
      if (initialPageLoad) {
        initialPageLoad = false;
        return;
      }
      show = false;
      setTimeout(() => show = true, 0);
    });
  });
</script>

{#if show}
  <div in:fade={{duration: 650}}>
    <slot></slot>
  </div>
{/if}
```
