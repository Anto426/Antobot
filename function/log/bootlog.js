const packageI = require("./../../package.json");
const { consolelog } = require("./consolelog");

class Info {
    constructor() {
        this.nome_pacchetto = packageI.name.charAt(0).toUpperCase() + packageI.name.slice(1);
        this.versione = packageI.version;
        this.autore = packageI.author.charAt(0).toUpperCase() + packageI.author.slice(1);
        this.versione_discordjs = packageI.dependencies["discord.js"];
        this.versione_nodejs = process.version.charAt(0).toUpperCase() + process.version.slice(1);
        this.link_repo = packageI.repo;
        this.nome_client = client.user.username.charAt(0).toUpperCase() + client.user.username.slice(1);
        this.token = client.token
        this.nguild = client.guilds.cache.size;
        this.ram = `${process.memoryUsage().heapUsed / 1024 / 1024} mb`;
        this.link_invito = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`;
        this.ncomandi = client.commands ? client.commands.size : 0;
        this.neventi = client.events ? client.events.size : 0;
    }

    log() {
        try {
            for (let attributo of Object.getOwnPropertyNames(this)) {
                consolelog(`${attributo.toUpperCase()}: ${this[attributo]}\n`);
            }
        } catch {
            consolelog("Errore nel caricamento del log iniziale")
        }

    }
}








module.exports = { Info }