const { shashcomandregisterallguild } = require("../../function/configs/comandregister")
const { feste } = require("../../function/feste/serverupdate")

const configs = require("./../../index")
module.exports = {
    name: "ready",
    async execute() {

        console.log(`
        
        logged to ${configs.client.user.tag}

        Numbers Guils : ${configs.client.guilds.cache.size}

        `)
        configs.client.user.setStatus("online")

        shashcomandregisterallguild()


        feste()
    }



}