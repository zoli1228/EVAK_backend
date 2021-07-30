

const timestamp = require("./timestamp.js")
const fs = require("fs")
const logFile = `../EVAK_backend/log/server_log_${timestamp("year")}-${timestamp("month")}.txt`
const clientAddress = require("./getclientaddress.js")
const counterLoc = "./script/total_logs.cnt"
const startTimeMs = timestamp("precision");
let logId = 0
let totalCount = -222;
let log = function (data) {
  console.log(data)
  fs.appendFile(logFile, data + "\r\n", (err) => { if (err) { console.error(err) } })
}

/* try {
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
} */



function myLogger(message, req, status) {
  let content = ""
  try {
    content = fs.readFileSync(counterLoc, { encoding: "utf8" })
  }
  catch (err) {
    console.log("Error reading file: " + err)
  }
  let total = parseInt(content)
  if (!req && !status) {
    
    log(`Log ID: ${total}`)
    log(`Message: ${message}`)
    log(`Time: ${timestamp()}`)
    log("")
  }

  else {

    let address = clientAddress.getClientAddress(req)
    let currentTimeMs = timestamp("precision")
    let username = "user"
    if(req.session.user) {
      username = req.session.user.username 
    } 
    else {
      username = req.body.username
    }
    let logLines = [
      `+ Request Log ID: [ ${total} ]`,
      "",
      "  -" +timestamp(),
      "  -Username:   " + username,
      "  -Method:     " + req.method,
      "  -Browser:    " + req.headers['user-agent'],
      "  -Address:    " + address,
      "  -Event:      " + message,
      "  -Status:     " + status,
      "  -Req URL:    " + 'https://' + req.headers.host + req.url,
      "  -Server uptime: " + (currentTimeMs - startTimeMs) + "s",
      "\r\n"
    ]

    for (let i = 0; i < logLines.length; i++) log(logLines[i])
  }
  let newTotal = total + 1
  let newTotalString = newTotal.toString();
  try {
    fs.writeFileSync(counterLoc, newTotalString, (data)=>{console.log(data)})
  } catch (err) { console.log("Error writing file: " + err) }
  logId++
}


module.exports = myLogger
