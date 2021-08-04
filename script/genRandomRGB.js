let returnColour = () => {
    let colour = Math.round(Math.random() * 255)
    return colour;
}

let genRandomColour = () => {
    let R = Math.round(Math.random() * (255 - 100) + 100)
    let G = Math.round(Math.random() * (255 - 100) + 100)
    let B = Math.round(Math.random() * (255 - 100) + 100)

    return { R, G, B }
}

module.exports = genRandomColour