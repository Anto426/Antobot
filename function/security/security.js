const fs = require("fs")
const { check } = require("../check/check")
class securyty extends check {

    constructor() {
        this.owner = false
        this.Sowner = false
        this.staff = false
        this.higtofp = false
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

    checkpermision(iduser, idguild) {
        super.checkpermision(iduser, idguild)
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

}

module.exports = {
    securyty
}