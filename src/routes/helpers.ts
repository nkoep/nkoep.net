import { error } from "@sveltejs/kit";

export function makeLoader(pathPrefix: string) {
  return async ({ params }) => {
    try {
      const content = await import(`../${pathPrefix}/${params.slug}.md`);
      return { body: content.default, ...content.metadata };
    } catch {
      throw error(404, "Not found");
    }
  };
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
