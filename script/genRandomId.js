let genRandomId = () =>{
    let string = ""
    let abc = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"
    let array = []
  
    for(let i = 0; i < 32; i++) {
        array.push(Math.round(Math.random() * 9))
        let randomIndex = (Math.floor(Math.random() * abc.length))
        array.push(abc[randomIndex])

    }
    
    for(item in array) {
        string += array[item]
    }

    return string;
}

module.exports = genRandomId