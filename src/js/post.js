import { fetchMarkdownResource, fetchTomlResource } from "./utils.js";

const postPrefix = "p";  // Ha!

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

class Post {
  constructor({title, date, basename}) {
    this.title = title;
    this.date = new PostDate(date);
    this.basename = basename;

    this.href = `/${postPrefix}/${basename}`;
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

export async function getPosts() {
  const resource = await fetchTomlResource("/posts.toml");
  return resource.posts.map(post => new Post(post));
}

export async function findPost(pathname) {
  const matches = pathname.match(new RegExp(`^\/${postPrefix}\/(.*)`));
  if (!matches) {
    return null;
  }
  const posts = await getPosts();
  const basename = matches[1];
  for (const post of posts) {
    if (basename === post.basename) {
      return post;
    }
  }
  return null;
}
