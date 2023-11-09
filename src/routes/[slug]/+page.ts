import { error } from "@sveltejs/kit";

export async function load({ params }) {
  try {
    const content = await import(`../../pages/${params.slug}.md`);
    return { body: content.default, ...content.metadata };
  } catch {
    throw error(404, "Not found");
  }
}
