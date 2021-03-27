const ts = require("./timestamp.js")
const fs = require("fs")
const logFile = `../EVAK_backend/log/server_log_${ts.timestamp("year")}-${ts.timestamp("month")}.txt`
const clientAddress = require("./getclientaddress.js")
let logId = 0


let log = function(data) {
    console.log(data)
    fs.appendFile(logFile, data + "\r\n", (err) => {if(err) {console.error(err)}})
  }

module.exports = {



myLogger : function(req, message, status) {
    if(req == 0 && !status) {
      log(`----${ts.timestamp()}---${message}----`)
      return;
    } 
  
  
    
    
    let address = clientAddress.getClientAddress(req)
    let totalNumId;
    let totalId = fs.readFile("../EVAK_backend/log/total.counter", (err, data) => {
        if(err) {console.error(err)}
        else {
            try {
                totalNumId = parseInt(data)

            } catch (e) {
                console.error(e)
            }
        }
    })
    
    let logLines = [
      `----- Entry no: [ ${logId} ] of total [ ${totalId} ]------`,
      "Timestamp:  " + ts.timestamp(),
      "Address:    " + address,
      "Event:      " + message,
      "Status:     " + status,
      "\r\n "
    ]
  
    for(let i = 0; i < logLines.length; i++)
    {
      log(logLines[i])
    }

    totalNumId++
   fs.writeFile("../EVAK_Backend/log/total.counter", totalNumId.toString(), (err) => {console.error(err)})
    logId++
  }

  
}