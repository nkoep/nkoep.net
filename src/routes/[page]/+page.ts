import { error } from "@sveltejs/kit";

export async function load({ params }) {
  try {
    const page = await import(`../../pages/${params.page}.md`);
    return { body: page.default, ...page.metadata };
  } catch {
    throw error(404, "Not found");
  }
}
