import type { Post } from "$lib/types";

export async function load({ fetch }) {
  const response = await fetch("/p");
  const posts: Post[] = await response.json();
  return { posts };
}
