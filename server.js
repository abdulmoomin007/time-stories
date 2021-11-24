const http = require("http");
const https = require("https");

let docString = "";
let result = [];

http
  .createServer(function (req, resp) {
    if (req.url == "/") {
      resp.end("Please got to /getTimeStories path...");
    }
    if (req.url === "/getTimeStories") {
      https
        .get("https://time.com/", (res) => {
          res.on("data", (d) => {
            docString += d;
          });
          res.on("end", function () {
            //   console.log(/(<section.*>)(.*)(<\/section>)/.test(docString));
            docString = docString.slice(
              docString.indexOf(
                '<section class="homepage-module latest" data-module_name="Latest Stories">'
              )
            );
            docString = docString.slice(0, docString.indexOf("</section>"));
            docString = docString.match(/<a href=.*\/a>/g);
          });
        })
        .on("error", (e) => {
          console.error(e);
        });

      if (docString != "" && docString != null) {
        result = [];
        docString.forEach((el) => {
          result.push({
            title: el.slice(el.indexOf(">") + 1, el.lastIndexOf("<")),
            link:
              "https://time.com" + el.slice(el.indexOf("/"), el.indexOf(">")),
          });
        });
      }
      if (result.length == 0) {
        resp.end(JSON.stringify({ request: "Please reload" }));
      } else {
        resp.end(JSON.stringify(result));
      }
      // console.log(result.length);
    }
  })
  .listen(8080);
