export type Post = {
  title: string;
  date: string;
  slug: string;
};

export type PageProps = {
  body: import("svelte").Component;
  title: string;
  date?: string | null;
  header?: string | null;
};
