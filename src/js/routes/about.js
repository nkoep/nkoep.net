import Route from "./route.js";

export default class AboutRoute extends Route {
  constructor(pattern) {
    super(pattern, "/pages/about.md", "About");
  }
}

