import type { Load } from "@sveltejs/kit";

import type { Post } from "$lib/types";

export const load: Load = async ({ fetch }) => {
  const response = await fetch("/p.json");
  const posts: Post[] = await response.json();
  return { posts };
};
