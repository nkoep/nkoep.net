import posts from "./_posts.js";

const lookup = new Map();
posts.forEach(post => lookup.set(post.slug, JSON.stringify(post)));

export function get(request, response, next) {
  const { slug } = request.params;

  if (lookup.has(slug)) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });

    response.end(lookup.get(slug));
  } else {
    response.writeHead(404, {
      "Content-Type": "application/json"
    });

    response.end(JSON.stringify({
      message: "Not found"
    }));
  }
}
