import Route from "./route.js";

export default class MiscRoute extends Route {
  constructor(pattern) {
    super(pattern, "/pages/misc.md", "Misc");
  }
}
