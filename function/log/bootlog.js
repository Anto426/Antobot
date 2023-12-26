const packageI = require("./../../package.json");
const Table = require('cli-table3');

class Info {
    constructor() {
        this.autore = packageI.author.charAt(0).toUpperCase() + packageI.author.slice(1);
        this.versione_discordjs = packageI.dependencies["discord.js"];
        this.versione_nodejs = process.version.charAt(0).toUpperCase() + process.version.slice(1);
        this.link_repo = packageI.repo;
        this.nome_client = client.user.username.charAt(0).toUpperCase() + client.user.username.slice(1);
        this.token = client.token;
        this.openai_token = client.openaitoken;
        this.git_token = client.gitToken
        this.nguild = client.guilds.cache.size;
        this.ram = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} mb`;
        this.link_invito = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands+bot`


    }

    log() {
        try {
            const settable = {
                'top': '', 'top-mid': '', 'top-left': '╔', 'top-right': '╗',
                'bottom': '', 'bottom-mid': '', 'bottom-left': '╚', 'bottom-right': '╝',
                'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
                'right': '║', 'right-mid': '╢', 'middle': '│'
            }
            const GeneralTable = new Table({
                head: [`${packageI.name.charAt(0).toUpperCase() + packageI.name.slice(1)} v `, packageI.version],
                colWidths: [25, 117],
                style: {
                    head: ['yellow'],
                    border: ['white'],
                    compact: false,
                    wordWrap: true,
                },
                chars: settable,

            });


            const EventsTable = new Table({
                head: ["Event Load:" + [client.events.size]],
                colWidths: [61],
                style: {
                    head: [client.events.size > 0 ? 'green' : 'red'],
                    border: ['white'],
                    compact: false
                },
                chars: settable,
            });




            const ComandsTable = new Table({
                head: ["Comand Load:" + [client.commands.size]],
                colWidths: [20, 40],
                style: {
                    head: [client.commands.size > 0 ? 'green' : 'red'],
                    border: ['white'],
                    compact: false
                },
                chars: settable
            });

            client.events.forEach(element => {
                EventsTable.push(["Name:" + [element.name]])
            });

            client.commands.forEach(element => {
                ComandsTable.push(["Name:" + element.name, "Description:" + element.data.description])
            });




            for (let attributo of Object.getOwnPropertyNames(this)) {
                if (this[attributo]) {
                    const value = this[attributo];
                    GeneralTable.push({ [attributo.charAt(0).toUpperCase() + attributo.slice(1)]: value });
                }
            }

            console.log(GeneralTable.toString())

            console.log(ComandsTable.toString())

            console.log(EventsTable.toString())

        } catch (err) { console.log(err) }
    }

}
module.exports = { Info }