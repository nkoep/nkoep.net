import "core-js/stable";
import "regenerator-runtime/runtime";

import hljs from "highlight.js/lib/highlight";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
import "highlight.js/styles/github.css";

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
  faGithub, faInstagram, faTwitter , faLastfm
} from "@fortawesome/free-brands-svg-icons"

import createRouter from "./js/router.js";

import "./sass/main.scss";

[faGithub, faInstagram, faTwitter, faLastfm].forEach(
  icon => library.add(icon)
);
dom.watch();

const router = createRouter();

document.addEventListener("DOMContentLoaded", () => {
  router.mountComponents();
  window.onpopstate = event => {
    router.route(event.state || window.location.pathname);
  };
  router.route(window.location.pathname);
});
