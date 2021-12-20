let checkDate = (input) => {
    let date = new Date()
    let inputDate = input.getTime() - (1000 * 3600)
    let currentDate = date.getTime()
    let sum = inputDate - currentDate
    console.log("Input: " + inputDate)
    console.log("Current: " + currentDate)
    if(sum > 0) {
        return true
    } else {
        return false
    }
}

module.exports = checkDate