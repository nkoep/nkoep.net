import "core-js/stable";
import "regenerator-runtime/runtime";

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub, faInstagram, faTwitter , faLastfm
} from "@fortawesome/free-brands-svg-icons"

import { registerLanguage } from "highlight.js/lib/highlight";
import shell from "highlight.js/lib/languages/shell";
import python from "highlight.js/lib/languages/python";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/atom-one-dark.css";

import createRouter from "./js/router.js";

import "normalize.css";
import "./main.scss";

// Configure fontawesome.
library.add(faBars, faTimes, faGithub, faInstagram, faTwitter, faLastfm);
dom.watch();

// Configure highlight.js.
const languages = {
  shell, python, javascript
}
for (const language in languages) {
  registerLanguage(language, languages[language]);
}

const router = createRouter();

document.addEventListener("DOMContentLoaded", () => {
  router.mountComponents();
  window.onpopstate = event => {
    router.route(event.state || window.location.pathname);
  };
  router.route(window.location.pathname);
});
