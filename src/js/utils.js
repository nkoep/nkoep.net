import * as showdown from "showdown";
// const showdown = require("showdown");
import showdownHighlight from "showdown-highlight";

function retrieveResource(url) {
  return new Promise(function(resolve) {
    const xhr = new XMLHttpRequest();
    // Bypass the browser cache on repeated page requests.
    xhr.open("GET",
             url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
    xhr.onreadystatechange = function() {
      // TODO: Check for failure.
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        resolve(xhr.responseText);
        return;
      }
    }
    xhr.send();
  });
}

export default async function fetchMarkdownResource(url) {
  const converter = new showdown.Converter({
    extensions: [showdownHighlight]
  });
  const md = await retrieveResource(url);
  return converter.makeHtml(md);
}
