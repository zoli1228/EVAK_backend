const fs = require("fs")
const userModel = require("./userschema")

const createModule = async (template, {...data}, user) => {
    let stringTemplate = "<span>No data</span>"
    let userPlaceholder = {
        username: "No data"
    }
    if (!{data}) {data = {
        data: "no data"
    }
}

    if(user) {
        userPlaceholder = await userModel.findOne({username : user}).catch(err => {return console.log("No such user" + err)})
    }
    if(template) {
        stringTemplate = fs.readFileSync(template).toString()
    }
    return {
        user: userPlaceholder.username,
        data: data,
        template: stringTemplate
    }
}

module.exports = createModule