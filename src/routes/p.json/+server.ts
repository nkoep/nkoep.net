import type { Post } from "$lib/types";
import { json } from "@sveltejs/kit";

interface Metadata {
  title: string;
  date: string;
}

function isMetadata(value: unknown): value is Metadata {
  return (
    typeof value === "object" &&
    value !== null &&
    "title" in value &&
    typeof (value as Metadata).title === "string" &&
    "date" in value &&
    typeof (value as Metadata).date === "string"
  );
}

function parseFileData(path: string, filename: unknown, value: unknown): Post {
  if (
    !filename ||
    typeof filename !== "string" ||
    !value ||
    typeof value !== "object" ||
    !("metadata" in value) ||
    !isMetadata(value.metadata)
  ) {
    throw `Invalid post '${path}'`;
  }
  const slug = filename.replace(".md", "");
  return { slug, ...value.metadata };
}

export const prerender = true;

export async function GET() {
  const paths = import.meta.glob("/src/posts/*.md", { eager: true });
  const posts: Post[] = [];
  for (const path in paths) {
    const file = paths[path];
    const filename = path.split("/").at(-1);
    const post = parseFileData(path, filename, file);
    posts.push(post);
  }
  posts.sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime(),
  );
  return json(posts);
}
