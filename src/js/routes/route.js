export default class Route {
  load() {
    return document.createElement("div");
  }

  // TODO: This method needs to be async, since the load methods below
  //       generally will have to asynchronously fetch resources.

  render(pathname) {
    const outlet = document.getElementById("outlet");

    // Remove the fade class if it exists so the current content is hidden
    // immediately once we set its opacity.
    outlet.classList.remove("fade");
    outlet.style.opacity = 0;

    // Add the fade class, set the new content and transition to full opacity.
    outlet.innerHTML = "";
    outlet.appendChild(this.load(pathname));
    outlet.classList.add("fade");
    outlet.style.opacity = 1;
  }
}

