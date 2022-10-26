const configs = require("./../../index")
async function feste() {
    for (let i in configs.feste.mout) {
        if (new Date().getMonth() + 1 == i) {
            configs.client.guilds.cache.forEach(f => {
                f.channels.cache.forEach(x => {
                    for (let z in configs.feste.default.channel) {
                        console.log(x.name.includes(configs.feste.default.channel[z]))
                        x.setName(x.name.replace(configs.feste.default.channel[z], configs.feste.mout[new Date().getMonth() + 1].channel[z]))
                    }
                });
            })

        }
    }



}


module.exports = {
    feste: feste
}