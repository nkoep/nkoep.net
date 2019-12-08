import Route from "./route.js";

export default class MediaRoute extends Route {
  constructor(pattern) {
    super(pattern, "/pages/media.md", "Media");
  }
}
