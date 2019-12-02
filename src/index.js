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
  router.route(window.location.pathname)
});
