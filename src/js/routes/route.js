import fetchMarkdownResource from "../utils.js";

export default class Route {
  constructor(staticResource) {
    this.staticResource_ = staticResource;
  }

  generateError_(message) {
    return `<div class="error">${message}</div>`;
  }

  async load() {
    if (this.staticResource_ !== undefined) {
      const content = await fetchMarkdownResource(this.staticResource_);
      if (content === null) {
        return this.generateError_("Resource not found");
      }
      return content;
    }
    // This should never be reached in production.
    return this.generateError_("No content");
  }

  async render(pathname) {
    const outlet = document.getElementById("outlet");

    const content = await this.load(pathname);
    outlet.innerHTML = "";

    // We wrap the content in another div so we can fade in the new content.
    const inner = document.createElement("div");
    inner.className = "fadein";
    if (typeof content === "string") {
      inner.innerHTML = content;
    } else {
      inner.appendChild(content);
    }

    outlet.appendChild(inner);
  }
}
