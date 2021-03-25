const express = require("express");
const app = express();
const port = 3000



app.listen(port, () => {
  console.log("Application started and Listening on port " + port);
});

app.use(express.static(__dirname + "/test_page/"));

app.get("", (req, res) => {
    myLogger("Home accessed")
    res.sendFile(__dirname + "/test_page/index.html");
});

let myLogger = (message) => {
    console.log(message)
}