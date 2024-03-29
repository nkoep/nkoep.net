import * as fs from "fs";

import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import config from "sapper/config/rollup.js";
import headings from "remark-autolink-headings";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import slug from "remark-slug";
import svelte from "rollup-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import { mdsvex } from "mdsvex";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) => {
  return (
    (warning.code === "MISSING_EXPORT" && /'preload'/.test(warning.message)) ||
    (warning.code === "CIRCULAR_DEPENDENCY" &&
      /[/\\]@sapper[/\\]/.test(warning.message)) ||
    onwarn(warning)
  );
};

const watchPosts = {
  buildStart() {
    const basepath = "./posts";
    const files = fs.readdirSync(basepath);
    files.forEach(file => this.addWatchFile(`${basepath}/${file}`));
  }
};

const scssInSvelte = sveltePreprocess({
  scss: {
    includePaths: ["src"],
  },
  postcss: {
    plugins: [require("autoprefixer")]
  }
});

const preprocess = [
  mdsvex({
    layout: "src/routes/_mdsvex_layout.svelte",
    extension: ".md",
    remarkPlugins: [
      slug,
      [
        headings,
        {
          linkProperties: {
            ariaHidden: true,
            tabIndex: -1,
            className: "icon-link"
          },
          content: {
            type: "text",
            value: "#"
          }
        }
      ]
    ]
  }),
  scssInSvelte
];

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      json(),
      watchPosts,
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
        "preventAssignment": true
      }),
      svelte({
        emitCss: true,
        extensions: [".svelte", ".md"],
        preprocess,
        compilerOptions: {
          dev,
          hydratable: true
        }
      }),
      resolve({
        browser: true,
        dedupe: ["svelte"]
      }),
      commonjs(),
      legacy && babel({
        extensions: [".js", ".mjs", ".html", ".svelte"],
        babelHelpers: "runtime",
        exclude: ["node_modules/@babel/**"],
        presets: [
          ["@babel/preset-env", {
            targets: "> 0.25%, not dead"
          }]
        ],
        plugins: [
          "@babel/plugin-syntax-dynamic-import",
          ["@babel/plugin-transform-runtime", {
            useESModules: true
          }]
        ]
      }),
      !dev && terser({
        module: true
      })
    ],
    preserveEntrySignatures: false,
    onwarn
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      json(),
      watchPosts,
      replace({
        "process.browser": false,
        "process.env.NODE_ENV": JSON.stringify(mode),
        "preventAssignment": true
      }),
      svelte({
        extensions: [".svelte", ".md"],
        preprocess,
        compilerOptions: {
          generate: "ssr",
          dev,
          hydratable: true
        }
      }),
      resolve({
        dedupe: ["svelte"]
      }),
      commonjs()
    ],
    external: Object.keys(pkg.dependencies).concat(
      require("module").builtinModules || Object.keys(process.binding("natives"))
    ),
    preserveEntrySignatures: "strict",
    onwarn
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
        "preventAssignment": true
      }),
      commonjs(),
      !dev && terser()
    ],
    preserveEntrySignatures: false,
    onwarn
  }
};
