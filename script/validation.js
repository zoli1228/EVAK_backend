function validateUsername(username) {
    let userRegExp = /^[a-zA-Z0-9]+$/
    username = username.trim()
    let response = ""
    if (username.includes(" ")) response += "A felhasználónév nem tartalmazhat szóközt. "
    if (username.length < 5) response += "A felhasználónév legalább 5 karakterből kell álljon. "
    if (username.length > 16) response += "A felhasználónév maximum 16 karakter lehet. "
    if (!username.match(userRegExp)) { response += "Csak kis- és nagybetűk, valamint számok engedélyezettek. " }
    if (response == "") { response = "OK" }
    return response
}
function validateEmail(email) {
    let regExp = /^[^\s@]+@[^\s@]+$/
    email = email.trim()
    let response = ""
    if (!email.match(regExp)) { response += "Az email cím helytelen. " }
    if (response == "") { response = "OK" }
    return response
}
function validatePassword(password, cpassword) {

    password = password.trim()
    password = password.toLowerCase()
    cpassword = cpassword.trim()
    cpassword = cpassword.toLowerCase()

    let response = ""
    if(password.length < 8) {response += "A jelszó legalább 8 karakterből kell álljon. "}
    if(password.length > 30) {response += "A jelszó maximum 30 karakterből állhat. "}
    if(password !== cpassword) {response += "A jelszó és a megerősítő jelszó nem egyezik. "}
    if (response == "") { response = "OK" }
    return response
}

module.exports = {
    validateUsername,
    validatePassword,
    validateEmail
}