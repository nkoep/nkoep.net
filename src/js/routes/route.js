export default class Route {
  load() {
    return document.createElement("div");
  }

  // TODO: This method needs to be async, since the load methods below
  //       generally will have to asynchronously fetch resources.

  async render(pathname) {
    const outlet = document.getElementById("outlet");

    // Remove the fade class if it exists so the current content is hidden
    // immediately once we set its opacity.
    outlet.classList.remove("fade");

    // TODO: Also animate the page footer.

    // Add the fade class, set the new content and transition to full opacity.
    // This needs to be slightly delayed, otherwise the animation won't fire.
    outlet.innerHTML = "";
  // setTimeout(() => {
    outlet.classList.add("fade");
    const content = await this.load(pathname);
    if (typeof content === "string") {
      outlet.innerHTML = content;
    } else {
      outlet.appendChild(content);
    }
  // }, 100);
  }
}
