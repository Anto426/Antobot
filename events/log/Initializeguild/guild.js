const configs = require("./../../../index")
module.exports = {
    name: "ready",
    async execute() {

        configs.guildrepo = configs.client.guilds.cache.get(configs.settings.antoslog.id)
        configs.guildrepo.channels.cache.forEach(x => {
            x.name = x.name.replace(/「[^\p{L}\p{N}\p{P}\p{Z}^$\n]」/gu , '');
            configs.guildrepo[x.name] = x
        });

    }
}