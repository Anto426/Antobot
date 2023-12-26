const { check } = require("../check/check")
class securyty extends check {

    constructor() {
        super()
        this.owner = false
        this.Sowner = false
        this.staff = false
        this.position = false
        this.channel = false
    }



    chekowner(arr, id) {
        super.chekowner(arr, id)
            .then(() => {
                this.owner = true;
            })
            .catch(() => {

            })

    }

    checksowner(iduser, idguild) {
        super.checksowner(iduser, idguild)
            .then(() => {
                this.owner = true;
            })
            .catch(() => {

            })

    }
    checkpchannel(idchannel, arr) {
        super.checkpchannel(idchannel, arr)
            .then(() => {
                this.channel = true;
            })
            .catch(() => {

            })
    }

    checkpermision(iduser, idguild, permision) {
        super.checkpermision(iduser, idguild, permision)
            .then(() => {
                this.staff = true;
            })
            .catch(() => {

            })
    }

    checkposition(iduser, otheruserid, guildid) {
        super.checkposition(iduser, otheruserid, guildid)
            .then(() => {
                this.position = true;
            })
            .catch(() => {

            })
    }

    allowcomand(OnlyOwner, chekposition, sizeofpermision, sizeofchannelallow) {
        return new Promise(async (resolve, reject) => {

            if (this.owner) {
                return r
            } else {
                if (this.Sowner && !OnlyOwner) {
                    return resolve(0)
                } else {
                    if (OnlyOwner) return reject(0)
                    if ((sizeofpermision <= 0 ? false : true) == this.staff) {
                        if (this.position == chekposition) {
                            if ((sizeofchannelallow <= 0 ? false : true) == this.channel) {
                                return resolve(1)
                            } else {
                                return reject(3)
                            }
                        } else {
                            return reject(2)
                        }
                    } else {
                        return reject(1)
                    }
                }
            }
        })

    }

}

module.exports = {
    securyty
}