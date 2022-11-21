const configs = require("./../../index")
async function feste() {
    for (let i in configs.feste.mout) {

        if (new Date().getMonth() + 1 == i) {
            console.log(i)
            configs.client.guilds.cache.forEach(f => {
                f.setIcon(configs.feste.mout[i].photo)
                f.channels.cache.forEach(x => {
                    for (let z in configs.feste.default.channel) {
                        if (x.name.includes(configs.feste.default.channel[z]))
                            x.setName(x.name.replace(configs.feste.default.channel[z], configs.feste.mout[i].channel[z]))
                    }
                });
            })

        } else {
            if (new Date().getMonth() == i) {
                console.log("hi")
                configs.client.guilds.cache.forEach(f => {
                    f.setIcon(configs.feste.default.photo)
                    f.channels.cache.forEach(x => {
                        for (let z in configs.feste.mout[i].channel) {
                            if (x.name.includes(configs.feste.mout[i].channel[z]))
                                x.setName(x.name.replace(configs.feste.mout[i].channel[z], configs.feste.default.channel[z]))
                        }
                    });
                })
            }

        }
    }



}


module.exports = {
    feste: feste
}