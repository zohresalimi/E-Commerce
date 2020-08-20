const express = require("express");
const app = express();

app.get("/", (request, response) => {
  console.log(`Request is somthing like : ${request}`);
  response.send("Response");
});

app.listen("3000", () => {
  console.log("Listening ...");
});
