class _Route {
  load() {
    return "";
  }

  render(location) {
    const outlet = document.getElementById("outlet");

    // Remove the fade class if it exists so the current content is hidden
    // immediately once we set its opacity.
    outlet.classList.remove("fade");
    outlet.style.opacity = 0;

    // Add the fade class, set the new content and transition to full opacity.
    outlet.innerHTML = this.load();
    outlet.classList.add("fade");
    outlet.style.opacity = 1;
  }
}

class Home extends _Route {
  load(location) {
    // TODO: Retrieve an article list and add them to the front page.
    return `
      <span style="color: green">Hi</span>
    `
  }
}

class About extends _Route {
  load(location) {
    return `
      <span style="color: green">Hi from About page</span>
    `
  }
}

class Art extends _Route {
  load(location) {
    return `
      <div>Art'n shit</divY
    `;
  }
}

class Misc extends _Route {
  load(location) {
    return `
      Here, we'll have a reading log 'n shit
    `;
  }
}

class Post extends _Route {
  load(pathname) {
    // We don't explicitly check if pathname begins with
    // "/articles" since the regex match should have taken
    // care of this.
    const name = pathname.split("/articles", 1)[1];
    // const content = await utils.fetchPost(name + ".md");

    // TODO: Use element.scrollIntoView if we can find an id with the given
    //       hash.
    const hash = window.location.hash;
  }
}

class Router {
  constructor() {
    this.routes_ = [];
  }

  createNavbar_() {
    const nav = document.createElement("nav");
    nav.id = "navbar";

    const entries = ["About", "Art", "Misc"];
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

  // TODO: Create navbar and links here.
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

  add(re, route) {
    this.routes_.push([re, route]);
  }

  fixUpInternalLinks_() {
    const app = document.getElementById("app");
    // Hook into click events for internal links so we don't reload pages.
    Array.from(app.getElementsByClassName("link")).forEach(element => {
      element.onclick = event => {
        event.preventDefault();
        const pathname = event.target.pathname;
        if (pathname !== undefined && pathname !== window.location.pathname) {
          this.route(event.target.pathname);
          window.history.pushState(pathname, "", pathname);
        }
      };
    });
  }

  route(pathname) {
    for (let i = 0; i < this.routes_.length; ++i) {
      const [re, Route] = this.routes_[i];
      if (re.test(pathname)) {
        (new Route).render(pathname);
        this.fixUpInternalLinks_();
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
  router.add(/^\/art/, Art);
  router.add(/^\/misc$/, Misc);
  // router.add(/^\/articles\/./, Post);
  return router;
}
