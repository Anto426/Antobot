const { writecommand } = require("../commands/writecommands");
const { loadothermodules } = require("../loadothermodule/loadothermodule");
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
                setTimeout(async() => {
                    await new writecommand().commandallguild()
                    new loadothermodules().load()
                }, 400)
            } catch (err) {
                (err)
            }
        })
        .catch(async() => {
            await consolelog("Errore il Token non è valido il bot verrà killato", "red")
            process.exit(-1);
        })
}

function boot() {
    new time('Europe/Rome').setTimezone()
    new clientinit().intitialallclientbysettings()
        .then(() => {
            new loadeventsandcommand().loadall()
                .then(() => {
                    loging()
                })
                .catch(() => {
                    loging()
                })

        })
        .catch(async(err) => {
            await consolelog("Errore il client non è stato inizializato correttamete il bot verrà killato", "red")
            process.exit(-1);
        })
}

module.exports = { boot }