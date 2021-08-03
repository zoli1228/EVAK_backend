const fs = require("fs")
const userModel = require("./userschema")

const createModule = async (template, {...data}, user) => {
    let userPlaceholder = {
        username: "No data"
    }

    if(user) {
        userPlaceholder = await userModel.findOne({username : user}).catch((err) => {return console.log("No such user" + err)})
    }
    let stringTemplate = fs.readFileSync(template).toString()
    return {
        user: userPlaceholder.username,
        data: data,
        template: stringTemplate
    }
}

module.exports = createModule