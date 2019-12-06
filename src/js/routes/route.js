export default class Route {
  load() {
    return document.createElement("div");
  }

  async render(pathname) {
    const outlet = document.getElementById("outlet");

    // TODO: Also animate the page footer.

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
