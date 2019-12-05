import Route from "./route.js";
import fetchMarkdownResource from "../utils.js";

export default class MiscRoute extends Route {
  async load() {
    return await fetchMarkdownResource("/pages/misc.md");
  }
}
