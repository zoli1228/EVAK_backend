module.exports = {



    getClientAddress: function (req) {
        let address = req.ip.split(":").pop();

        switch (address) {

            case "134.255.109.166":
                return address + " Forczek Dávid"
            case "167.248.133.54" || "74.120.14.56" || "192.35.168.0" || "162.142.125.0":
                return address + " CENSYS scanning "

            default:
                return address
        }
    }
}