const fs = require("fs")
const { check } = require("../check/check")
class securyty extends check {

    constructor() {
        this.owner
        this.Sowner
        this.staff
        this.higtofp
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

}