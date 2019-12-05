import fetchMarkdownResource from "./utils.js";

export default class Post {
  constructor(title, date, basename) {
    this.title = title;
    this.date = date;
    this.basename = basename;

    this.content = null;
  }

  async fetchContent() {
    if (!this.content) {
      this.content = await fetchMarkdownResource(
        "/posts/" + this.basename + ".md");
    }
    return this.content;
  }
}
