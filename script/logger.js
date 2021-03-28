

const ts = require("./timestamp.js")
const fs = require("fs")
const logFile = `../EVAK_backend/log/server_log_${ts.timestamp("year")}-${ts.timestamp("month")}.txt`
const clientAddress = require("./getclientaddress.js")
const { count } = require("console")
const counterLoc = "./script/total_logs.cnt"
const startTimeMs = ts.timestamp("precision");
let logId = 0
let totalCount = -222;
let log = function (data) {
  console.log(data)
  fs.appendFile(logFile, data + "\r\n", (err) => { if (err) { console.error(err) } })
}

function getTotal() {
  let totalCounter = 0;
  try {
    fs.readFile(counterLoc, "utf8", (err, data) => {
      if (err) {
        console.log("Error " + err)
        return;
      }
      let content = data
      totalCounter = content;
      totalCount = parseInt(totalCounter)
    })
  }
  catch (err) {
    console.log("Error: " + err)
  }
}
getTotal()

module.exports = {
  myLogger: function (req, message, status) {
    if (req == 0 && !status) {
      log(`----${ts.timestamp()}---${message}----`)
      return;
    }
    let address = clientAddress.getClientAddress(req)
    let currentTimeMs = ts.timestamp("precision")
    let logLines = [
      `-----Session Entry no: [ ${logId} ]  Total Entry no: [ ${totalCount} ]------`,
      "",
      "Timestamp:  " + ts.timestamp(),
      "Browser:    " + req.headers['user-agent'],
      "Address:    " + address,
      "Event:      " + message,
      "Status:     " + status,
      "Req URL:    " + 'https://' + req.headers.host + req.url,
      "Server uptime: " + (currentTimeMs - startTimeMs) + "s",
      "\r\n"
    ]

    for (let i = 0; i < logLines.length; i++) log(logLines[i])
    let newTotal = (totalCount + 1).toString();
    fs.writeFile(counterLoc, newTotal, (err) => { if (err) console.log("Error writing counter file: " + err) })
    logId++
    getTotal()
  }
}