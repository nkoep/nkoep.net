import type { Post } from "$lib/types";
import { json } from "@sveltejs/kit";

export const prerender = true;

export async function GET() {
  const paths = import.meta.glob("/src/posts/*.md", { eager: true });
  const posts: Post[] = [];
  for (const path in paths) {
    const file = paths[path];
    if (file && typeof file === "object" && "metadata" in file) {
      const { metadata } = file;
      const slug = path.split("/").at(-1).replace(".md", "");
      posts.push({ slug, ...metadata } satisfies Post);
    }
  }
  posts.sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime()
  );
  return json(posts);
}
