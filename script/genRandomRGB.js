let returnColour = () => {
    let colour = Math.round(Math.random() * 255)
    return colour;
}

let genRandomColour = () => {
    let R = Math.round(Math.random() * (255 - 150) + 150)
    let G = Math.round(Math.random() * (255 - 150) + 150)
    let B = Math.round(Math.random() * (255 - 150) + 150)

    return { R, G, B }
}

module.exports = genRandomColour