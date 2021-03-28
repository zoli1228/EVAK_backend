module.exports = {



    getClientAddress: function (req) {
        let address = req.ip.split(":").pop();

        switch (address) {

            case "149.200.98.57":
                return address

            case "37.76.35.159":
                return address + " (Admin telefonja) "

            case "134.255.109.166":
                return address + " (Forczek Dávid telefonja) "
            case "167.248.133.54":
                return address + " (CenSys tracking service) "

            default:
                return address
        }
    }
}