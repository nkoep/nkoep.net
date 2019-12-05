import Route from "./route.js";

export default class MiscRoute extends Route {
  load() {
    const span = document.createElement("span");
    span.style.color = "purple";
    span.textContent = "reading list etc.";
    return span;
  }
}
