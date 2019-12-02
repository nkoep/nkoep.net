class _Route {
  constructor() {
    this.title = "";
  }

  render() {
    return "";
  }
}

class Home extends _Route {
  constructor() {
    super();
    this.title = "Home";
  }

  render() {
    return `
      <span style="color: green">Hi</span>
    `
  }
}

class About extends _Route {
  constructor() {
    super();
    this.title = "About";
  }

  render() {
    return `
      <span style="color: green">Hi from ${this.title}</span>
    `
  }
}

const routes = {
  "/": Home,
  "/about": About
};

export default function route(path) {
  console.log("routing...");
  const app = document.getElementById("app");
  const Route = routes[path];
  if (Route === undefined) {
    window.location.replace("/404");
  } else {
    app.innerHTML = (new Route()).render();
  }
}
