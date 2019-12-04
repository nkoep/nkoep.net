export default class Post {
  constructor(name, date, filename) {
    this.name = name;
    this.date = date;
    this.filename = filename;

    this.content = null;
  }

  async retrievePost() {
    return await new Promise(function(resolve) {
      const xhr = new XMLHttpRequest();
      const url = "/articles/" + this.filename;
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
}
