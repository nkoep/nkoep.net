class _Route {
  constructor(re) {
    this.re_ = re;
  }

  match(pathname) {
    return this.re_.test(pathname);
  }

  compile() {
    return "";
  }

  createNavbar_() {
    const nav = document.createElement("nav");

    const entries = ["About", "Projects", "Misc"];
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
    a.id = "logo";
    a.className = "link";
    a.textContent = "NK";
    a.href = "/";

    const ul = this.createSocialLinks_();

    [nav, a, ul].forEach(element => header.appendChild(element));
  }

  render(location) {
    const app = document.getElementById("app");

    const header = document.getElementById("header")
    if (header.children.length === 0) {
      header.html = this.populateHeader_(header);
    }

    const outlet = document.getElementById("outlet");
    outlet.innerHTML = this.compile();

    return app;
  }
}

class Home extends _Route {
  compile(location) {
    // TODO: Retrieve an article list and add them to the front page.
    return `
      <span style="color: green">Hi</span>
    `
  }
}

class About extends _Route {
  compile(location) {
    return `
      <span style="color: green">Hi from About page</span>
    `
  }
}

class Post extends _Route {
  compile(pathname) {
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

  // TODO: Create navbar and links here.
  mountComponents() {
    const app = document.getElementById("app");

    const header = document.createElement("div");
    header.id = "header";
    app.appendChild(header);

    const outlet = document.createElement("div");
    outlet.id = "outlet";
    app.appendChild(outlet);
  }

  add(route) {
    this.routes_.push(route);
  }

  route(pathname) {
    for (let i = 0; i < this.routes_.length; ++i) {
      const route = this.routes_[i];
      if (route.match(pathname)) {
        const app = route.render(pathname);
        // Hook into click events for internal links so we don't reload pages.
        Array.from(app.getElementsByClassName("link")).forEach(element => {
          element.onclick = (event) => {
            event.preventDefault();
            const pathname = event.target.pathname;
            console.log(event, pathname);
            this.route(pathname);
          };
        });
        return;
      }
    }
    window.location.replace("/404");
  }
}

export default function createRouter() {
  const router = new Router();
  router.add(new Home(/^\/$/));
  router.add(new About(/^\/about$/));
  // router.add(Post(/^\/articles\/./));
  return router;
}
