import fetchMarkdownResource from "./utils.js";

class PostDate {
  constructor(date) {
    this.originalDate_ = date;
    this.date_ = new Date(date);
  }

  year() {
    return this.date_.getFullYear();
  }

  valueOf() {
    return this.date_;
  }

  toString() {
    return this.originalDate_;
  }
}

export default class Post {
  constructor(title, date, basename) {
    this.title = title;
    this.date = new PostDate(date);
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
