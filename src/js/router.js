import Home from "./routes/home.js";
import About from "./routes/about.js";
import Misc from "./routes/misc.js";
import Post from "./routes/post.js";

class Router {
  constructor() {
    this.routes_ = [];
  }

  createMenuButton_(id, icon, onclick) {
    const span = document.createElement("span");
    span.className = `fas ${icon}`;
    const a = document.createElement("a");
    a.href = "javascript:void(0)";
    a.onclick = onclick;
    a.appendChild(span);

    const div = document.createElement("div");
    div.id = id;
    div.appendChild(a);
    return div;
  }

  createMenu_() {
    const menu = document.createElement("div");
    menu.id = "menu";

    const closeMenu = () => {
      menu.style.width = "0"
      document.querySelector("html").classList.remove("noscroll");
    };

    const closeButton = this.createMenuButton_(
      "close-button", "fa-times", closeMenu);
    const navbar = this.createNavbar_();
    const socialLinks = this.createSocialLinks_();

    [closeButton, navbar, socialLinks].forEach(
      element => menu.appendChild(element));

    // Close the menu when Escape is pressed.
    document.onkeyup = event => {
      event.preventDefault();
      const key = event.key;
      if (key === "Escape" || key === "Esc") {
        closeMenu();
      }
    };

    return menu;
  }

  createNavbar_() {
    const nav = document.createElement("nav");
    nav.className = "navbar";

    const ul = document.createElement("ul");

    const entries = ["About", "Misc"];
    entries.forEach(page => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "link";
      a.textContent = page;
      a.href = `/${page.toLowerCase()}`;
      li.appendChild(a);
      ul.appendChild(li);
    });
    nav.appendChild(ul);

    return nav;
  }

  refreshNavbar_(title) {
    const navs = document.getElementsByClassName("navbar");
    Array.from(navs).forEach(nav => {
      Array.from(nav.getElementsByTagName("a")).forEach(element => {
        if (element.textContent === title) {
          element.classList.add("active");
        } else {
          element.classList.remove("active");
        }
      });
    });
  }

  createLogo_() {
    const a = document.createElement("a");
    a.className = "link";
    a.textContent = "NK";
    a.href = "/";

    const div = document.createElement("div");
    div.id = "logo";
    div.appendChild(a);

    return div;
  }

  createSocialLinks_() {
    const links = {
      "github": "https://github.com/nkoep/",
      "instagram": "https://instagram.com/polylith_",
      "twitter": "https://twitter.com/spczf",
      "lastfm": "https://last.fm/user/cRZYFST"
    };

    const ul = document.createElement("ul");
    ul.className = "social";

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
    const menu = this.createMenu_();

    const openMenu = event => {
      event.preventDefault();
      menu.style.width = "100%";
      document.querySelector("html").classList.add("noscroll");
    };

    const navbar = this.createNavbar_();
    const logo = this.createLogo_();
    const socialLinks = this.createSocialLinks_();
    const menuButton = this.createMenuButton_(
      "menu-button", "fa-bars", openMenu);
    [menu, navbar, logo, socialLinks, menuButton].forEach(
      element => header.appendChild(element));
  }

  mountComponents() {
    const header = document.createElement("div");
    header.id = "header";
    this.populateHeader_(header);

    const outlet = document.createElement("div");
    outlet.id = "outlet";

    const app = document.getElementById("app");
    app.appendChild(header);
    app.appendChild(outlet);
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
      element.addEventListener("click", onClickCallback);
    });
  }

  async route(pathname) {
    for (let i = 0; i < this.routes_.length; ++i) {
      const route = this.routes_[i];
      if (route.match(pathname)) {
        await route.render(pathname);
        const title = route.getTitle();
        const name = "Niklas Koep";
        if (title) {
          document.title = `${title} | ${name}`;
        } else {
          document.title = name;
        }
        this.refreshNavbar_(title);
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
  router.add(/^\/misc/, Misc);
  router.add(/^\/post\/./, Post);
  return router;
}
