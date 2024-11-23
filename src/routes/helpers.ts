import { error } from "@sveltejs/kit";

type LoaderParams = {
  params: {
    slug: string;
  };
};

export function makeLoader(pathPrefix: string) {
  return async ({ params }: LoaderParams) => {
    try {
      const content = await import(`../${pathPrefix}/${params.slug}.md`);
      return { body: content.default, ...content.metadata };
    } catch {
      error(404, "Not found");
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
