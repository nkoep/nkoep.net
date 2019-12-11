import Route from "./route.js";

export default class ProjectsRoute extends Route {
  constructor(pattern) {
    super(pattern, "/pages/projects.md", "Projects");
  }
}
