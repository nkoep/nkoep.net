import "core-js/stable";
import "regenerator-runtime/runtime";

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub, faInstagram, faTwitter , faLastfm
} from "@fortawesome/free-brands-svg-icons"

import hljs from "highlight.js/lib/highlight";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import "highlight.js/styles/atom-one-dark.css";

import createRouter from "./js/router.js";

import "normalize.css";
import "./main.scss";

// Configure fontawesome.
library.add(faBars, faTimes, faGithub, faInstagram, faTwitter, faLastfm);
dom.watch();

// Configure syntax highlighting.
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);

const router = createRouter();

document.addEventListener("DOMContentLoaded", () => {
  router.mountComponents();
  window.onpopstate = event => {
    router.route(event.state || window.location.pathname);
  };
  router.route(window.location.pathname);
});
