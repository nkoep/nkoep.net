import * as showdown from "showdown";
import showdownHighlight from "showdown-highlight";

function retrieveResource(url) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    // Bypass the browser cache on repeated page requests.
    xhr.open("GET",
             url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
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

const converter = new showdown.Converter({
  extensions: [showdownHighlight]
});

export function convertMarkdown(md) {
  return converter.makeHtml(md);
}

export default async function fetchMarkdownResource(url) {
  const md = await retrieveResource(url);
  return convertMarkdown(md);
}
