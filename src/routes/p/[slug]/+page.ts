import { error } from "@sveltejs/kit";

export async function load({ params }) {
  try {
    const post = await import(`../../../posts/${params.slug}.md`);
    return { body: post.default, ...post.metadata };
  } catch {
  throw error(404, "Not found");
}
}
