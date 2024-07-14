
const packageI = require("./../../package.json");
const Table = require('cli-table3');

class Info {
    constructor() {
        this.author = packageI.author.charAt(0).toUpperCase() + packageI.author.slice(1);
        this.discordJsVersion = packageI.dependencies["discord.js"];
        this.nodeJsVersion = process.version.charAt(0).toUpperCase() + process.version.slice(1);
        this.repoLink = packageI.repo.toString();
        this.clientName = client.user.username.charAt(0).toUpperCase() + client.user.username.slice(1);
        this.token = client.token;
        this.openAiToken = process.env.OPENAI_TOKEN;
        this.gitToken = process.env.GIT_TOKEN;
        this.guildCount = client.guilds.cache.size;
        this.ramUsage = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
        this.inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands+bot`


    }

    log() {
        try {
            const settable = {
                'top': '', 'top-mid': '', 'top-left': '╔', 'top-right': '╗',
                'bottom': '', 'bottom-mid': '', 'bottom-left': '╚', 'bottom-right': '╝',
                'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
                'right': '║', 'right-mid': '╢', 'middle': '│'
            }


            //General

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

            for (let attributo of Object.getOwnPropertyNames(this)) {
                if (this[attributo]) {
                    const value = this[attributo];
                    GeneralTable.push({ [attributo.charAt(0).toUpperCase() + attributo.slice(1)]: value });
                }
            }

            //Base
            const BaseComandsTable = new Table({
                head: ["Command Load:" + [client.basecommands.size]],
                colWidths: [20, 40],
                style: {
                    head: [client.basecommands.size > 0 ? 'green' : 'red'],
                    border: ['white'],
                    compact: false
                },
                chars: settable
            });

            const BaseEventsTable = new Table({
                head: ["Event Load:" + [client.baseevents.size]],
                colWidths: [20, 40],
                style: {
                    head: [client.baseevents.size > 0 ? 'green' : 'red'],
                    border: ['white'],
                    compact: false
                },
                chars: settable,
            });

            client.basecommands.forEach(element => {
                BaseComandsTable.push(["Name:" + element.name, "Description:" + element.data.description])
            });
            client.baseevents.forEach(element => {
                BaseEventsTable.push(["Name:" + element.name, "Tipo di evento:" + element.typeEvent])
            });


            //Distube
            const DistubeGeneralTable = new Table({
                head: ["Command Load:" + [client.distubecommands.size]],
                colWidths: [20, 40],
                style: {
                    head: [client.distubecommands.size > 0 ? 'green' : 'red'],
                    border: ['white'],
                    compact: false
                },
                chars: settable
            });

            const DistubeEventsTable = new Table({
                head: ["Event Load:" + [client.distubeevents.size]],
                colWidths: [20, 40],
                style: {
                    head: [client.distubeevents.size > 0 ? 'green' : 'red'],
                    border: ['white'],
                    compact: false
                },
                chars: settable,
            });


            //push element 
            client.distubecommands.forEach(element => {
                DistubeGeneralTable.push(["Name:" + element.name, "Description:" + element.data.description])
            });
            client.distubeevents.forEach(element => {
                DistubeEventsTable.push(["Name:" + element.name, "Tipo di evento:" + element.typeEvent])
            });




            console.log(GeneralTable.toString())

            console.log("=".repeat(64));
            console.log("Base:")
            console.log(BaseComandsTable.toString())
            console.log(BaseEventsTable.toString())
            console.log("=".repeat(64));
            console.log("Distube:")
            console.log(DistubeGeneralTable.toString())
            console.log(DistubeEventsTable.toString())


        } catch (err) { console.log(err) }
    }

}
module.exports = { Info }