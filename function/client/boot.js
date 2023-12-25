const { writecommand } = require("../commands/writecommands");
const { Info } = require("../log/bootlog");
const { consolelog } = require("../log/consolelog");
const { time } = require("./../time/time")
const { clientinit } = require("./initclient");
const { loadeventsandcommand } = require("./loadcommand&events");
require("dotenv").config()

function loging() {
    client.login(process.env.TOKEN)
        .then(() => {
            try {
                new Info().log()
                setTimeout(() => {
                    new writecommand().commandallguild()
                }, 400)
            } catch (err) {
                console.log(err)
            }
        })
        .catch((err) => {
            console.log(err)
            consolelog("Errore il Token non è valido il bot verrà killato")
            process.exit(-1)
        })
}

function boot() {
    new time('Europe/Rome').setTimezone()
    new clientinit().intitialclientbase()
        .then(() => {
            new loadeventsandcommand().loadall()
                .then(() => {
                    loging()
                })
                .catch(() => {
                    loging()
                })

        })
        .catch((err) => {
            console.log(err)
            consolelog("Errore il client non è stato inizializato correttamete il bot verrà killato")
            process.exit(-1);
        })
}

module.exports = { boot }