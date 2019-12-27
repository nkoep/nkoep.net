import { Converter as MarkdownConverter } from "showdown";
import showdownHighlight from "showdown-highlight";
import { parse as parseToml } from "toml";

function retrieveResource(url) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    // Bypass the browser cache on repeated page requests in development mode.
    if (process.env.NODE_ENV === "development") {
      xhr.open("GET",
               url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
    } else {
      xhr.open("GET", url);
    }
    // Prevent browsers from trying to parse files (e.g., Firefox tries to
    // parse TOML files as XML).
    xhr.overrideMimeType("text/html");
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          // This is essentially an assert; it should never be relevant for
          // anything served in production.
          resolve(null);
        }
      }
    }
    xhr.send();
  });
}

const converter = new MarkdownConverter({
  extensions: [showdownHighlight],
  customizedHeaderId: true,
  ghCompatibleHeaderId: true
});

export function convertMarkdown(md) {
  return converter.makeHtml(md);
}

export async function fetchMarkdownResource(url) {
  const resource = await retrieveResource(url);
  return convertMarkdown(resource);
}

export async function fetchTomlResource(url) {
  const resource = await retrieveResource(url);
  return parseToml(resource);
}
