module.exports = {

timestamp: function(string) {
  
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = new Date();
    if(!string) {
      return `${date.getFullYear()}.${months[date.getMonth()]}.${date.getDate()} - ${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}:${(date.getSeconds() < 10 ? '0' : '') + date.getSeconds()}`
    }
    else if(string == "month") {
      return `${months[date.getMonth()]}`
    }
    else if(string == "year") {
      return `${date.getFullYear()}`
    }
  }
}
