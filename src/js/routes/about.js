import Route from "./route.js";

export default class AboutRoute extends Route {
  load() {
    const span = document.createElement("span");
    span.style.color = "green";
    span.textContent = "Hi from about page";
    return span;
  }
}

