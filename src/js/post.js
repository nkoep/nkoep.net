import fetchMarkdownResource from "./utils.js";

export default class Post {
  constructor(name, date, basename) {
    this.name = name;
    this.date = date;
    this.basename = basename;
  }

  async fetchContent() {
    return await fetchMarkdownResource("/posts/" + this.basename + ".md");
  }
}
