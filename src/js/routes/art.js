import Route from "./route.js";

export default class ArtRoute extends Route {
  load() {
    const span = document.createElement("span");
    span.style.color = "red";
    span.textContent = "art'n shit";
    return span;
  }
}
