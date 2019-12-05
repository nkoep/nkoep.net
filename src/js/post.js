import fetchMarkdownResource from "./utils.js";

export default class Post {
  constructor(title, date, basename) {
    this.title = title;
    this.date = date;
    this.basename = basename;
  }

  async fetchContent() {
    return await fetchMarkdownResource("/posts/" + this.basename + ".md");
  }
}
