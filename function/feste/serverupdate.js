const configs = require("./../../index")
async function feste() {
    for (let i in configs.feste.mout) {
        console.log(new Date().getMonth() + 3)
        if (new Date().getMonth() + 3== i) {
            console.log("yes")
            configs.client.guilds.cache.forEach(f => {
                f.setIcon(configs.feste.mout[i].photo)
                f.channels.cache.forEach(x => {
                    for (let z in configs.feste.default.channel) {
                        console.log(x.name, x.name.includes(configs.feste.default.channel[z]))
                        if (x.name.includes(configs.feste.default.channel[z]))
                            x.setName(x.name.replace(configs.feste.default.channel[z], configs.feste.mout[new Date().getMonth() + 1].channel[z]))
                    }
                });
            })

        } else {
            if (new Date().getMonth() == i) {
                console.log("hi")
                configs.client.guilds.cache.forEach(f => {
                    f.channels.cache.forEach(x => {
                        for (let z in configs.feste.mout[i].channel) {
                            console.log(x.name,configs.feste.mout[i].channel[z],x.name.includes(configs.feste.mout[i].channel[z]))
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