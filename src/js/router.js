import Home from "./routes/home.js";
import About from "./routes/about.js";
import Media from "./routes/media.js";
import Misc from "./routes/misc.js";
import Post from "./routes/post.js";

class Router {
  constructor() {
    this.routes_ = [];
  }

  createNavbar_() {
    const nav = document.createElement("nav");
    nav.id = "navbar";

    const entries = ["About", "Media", "Misc"];
    entries.forEach(page => {
      const a = document.createElement("a");
      a.className = "link";
      a.textContent = page;
      a.href = `/${page.toLowerCase()}`;
      nav.appendChild(a);
    });

    return nav;
  }

  createSocialLinks_() {
    const links = {
      "github": "https://github.com/nkoep/",
      "instagram": "https://instagram.com/polylith_",
      "twitter": "https://twitter.com/spczf",
      "lastfm": "https://last.fm/user/cRZYFST"
    };

    const ul = document.createElement("ul");
    ul.id = "social";

    for (let key in links) {
      const span = document.createElement("span");
      span.className = "fab fa-" + key;

      const a = document.createElement("a");
      a.href = links[key];
      a.target = "_blank";
      a.appendChild(span);

      const li = document.createElement("li");
      li.appendChild(a);
      ul.appendChild(li);
    }

    return ul;
  }

  populateHeader_(header) {
    const nav = this.createNavbar_();

    const a = document.createElement("a");
    a.id = "branding";
    a.className = "link";
    a.textContent = "Niklas Koep";
    a.href = "/";

    [a, nav].forEach(element => header.appendChild(element));
  }

  populateFooter_(footer) {
    const ul = this.createSocialLinks_();
    footer.appendChild(ul);
  }

  mountComponents() {
    const app = document.getElementById("app");

    const header = document.createElement("div");
    header.id = "header";
    this.populateHeader_(header);
    app.appendChild(header);

    const outlet = document.createElement("div");
    outlet.id = "outlet";
    app.appendChild(outlet);

    const footer = document.createElement("div");
    footer.id = "footer";
    this.populateFooter_(footer);
    app.appendChild(footer);
  }

  add(pattern, Route) {
    this.routes_.push(new Route(pattern));
  }

  trapInternalLinks_() {
    const app = document.getElementById("app");
    const onClickCallback = event => {
      event.preventDefault();
      const pathname = event.target.pathname;
      if (pathname !== undefined && pathname !== window.location.pathname) {
        if (event.ctrlKey) {
          window.open(pathname, "_blank");
        } else {
          this.route(pathname);
          window.history.pushState(pathname, "", pathname);
        }
      }
    };

    // Hook into click events for internal links so we don't reload pages.
    Array.from(app.getElementsByClassName("link")).forEach(element => {
      element.onclick = onClickCallback;
    });
  }

  async route(pathname) {
    for (let i = 0; i < this.routes_.length; ++i) {
      const route = this.routes_[i];
      if (route.match(pathname)) {
        await route.render(pathname);
        const title = route.getTitle();
        if (title) {
          document.title = `${title} | Niklas Koep`;
        } else {
          document.title = "Niklas Koep";
        }
        this.trapInternalLinks_();
        // FIXME: This works after popstate events, but not after full page
        //        loads.
        if (window.location.hash) {
          const element = document.getElementById(window.location.hash);
          if (element) {
            element.scrollIntoView();
          }
        }
        return;
      }
    }
    window.location.replace("/404");
  }
}

export default function createRouter() {
  const router = new Router();
  router.add(/^\/$/, Home);
  router.add(/^\/about$/, About);
  router.add(/^\/media/, Media);
  router.add(/^\/misc$/, Misc);
  router.add(/^\/post\/./, Post);
  return router;
}
