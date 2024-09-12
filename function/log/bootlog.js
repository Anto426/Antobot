
const packageI = require("./../../package.json");
const Table = require('cli-table3');

class LogStartup {
    constructor() {

        this.clientName = client.user.username.charAt(0).toUpperCase() + client.user.username.slice(1);
        this.version = packageI.version;
        this.author = packageI.author.charAt(0).toUpperCase() + packageI.author.slice(1);
        this.discordJsVersion = packageI.dependencies["discord.js"];
        this.nodeJsVersion = process.version.charAt(0).toUpperCase() + process.version.slice(1);
        this.ramUsage = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
        this.token = client.token;
        this.openAiToken = process.env.OPENAITOKEN;
        this.gitToken = process.env.GITTOKEN;
        this.inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permisions=8&scope=applications.commands+bot`,
            this.link = packageI.repo;

    }

    log() {
        try {


            let defaultLayout = {
                top: '━',
                'top-mid': '┳',
                'top-left': '┏',
                'top-right': '┓',
                bottom: '━',
                'bottom-mid': '┻',
                'bottom-left': '┗',
                'bottom-right': '┛',
                left: '┃',
                'left-mid': '┣',
                right: '┃',
                'right-mid': '┫',
                mid: '─',
                'mid-mid': '┼',
                middle: '│'
            }


            let HomeupLayout = {
                top: '━',
                'top-mid': '┳',
                'top-left': '┏',
                'top-right': '┓',
                bottom: ' ',
                'bottom-mid': '┃',
                'bottom-left': '┃',
                'bottom-right': '┃',
                left: '┃',
                'left-mid': '┣',
                right: '┃',
                'right-mid': '┫',
                mid: '─',
                'mid-mid': '┼',
                middle: '│'
            }

            let HomecenterLayout = {
                top: '━',
                'top-mid': '┳',
                'top-left': '┃',
                'top-right': '┃',
                bottom: ' ',
                'bottom-mid': ' ',
                'bottom-left': '┃',
                'bottom-right': '┃',
                left: '┃',
                'left-mid': '┣',
                right: '┃',
                'right-mid': '┫',
                mid: '─',
                'mid-mid': '┼',
                middle: '│'
            }

            let HomedownLayout = {
                top: '━',
                'top-mid': '┳',
                'top-left': '┃',
                'top-right': '┃',
                bottom: '━',
                'bottom-mid': '┻',
                'bottom-left': '┗',
                'bottom-right': '┛',
                left: '┃',
                'left-mid': '┣',
                right: '┃',
                'right-mid': '┫',
                mid: '─',
                'mid-mid': '┼',
                middle: '│'
            }

            const style = {
                head: ['bold', 'cyan'],
                border: ['green'],
                compact: true
            }




            //General

            const GeneralTable = new Table({
                head: ["Client Name", "Version", "Author", "Discord.js Version", "Node.js Version", "Ram Usage"],
                chars: HomeupLayout,
                style: style,
                colWidths: [49, 10, 14, 14, 14, 14],
                rowAligns: ["center", "center", "center", "center", "center", "center"],
                colAligns: ["center", "center", "center", "center", "center", "center"]
            });

            const GeneralTable1 = new Table({
                head: ["Token"],
                chars: HomecenterLayout,
                style: style,
                colWidths: [120],
                rowAligns: ["bottom"],
                colAligns: ["center"]
            });
            const GeneralTable2 = new Table({
                head: ["OpenAi Token"],
                chars: HomecenterLayout,
                style: style,
                colWidths: [120],
                rowAligns: ["bottom"],
                colAligns: ["center"]
            });
            const GeneralTable3 = new Table({
                head: ["Git Token"],
                chars: HomecenterLayout,
                style: style,
                colWidths: [120],
                rowAligns: ["bottom"],
                colAligns: ["center"]

            });

            const GeneralTable4 = new Table({
                head: ["Invite Link"],
                chars: HomecenterLayout,
                style: style,
                colWidths: [120],
                rowAligns: ["bottom"],
                colAligns: ["center"]
            });

            const GeneralTable5 = new Table({
                head: ["Git Repository"],
                chars: HomedownLayout,
                style: style,
                colWidths: [120],
                rowAligns: ["center"],
                colAligns: ["center"]
            });



            GeneralTable.push([this.clientName, this.version, this.author, this.discordJsVersion, this.nodeJsVersion, this.ramUsage])
            GeneralTable1.push([this.token])
            GeneralTable2.push([this.openAiToken])
            GeneralTable3.push([this.gitToken])
            GeneralTable4.push([this.inviteLink])
            GeneralTable5.push([this.link])

            console.log("=".repeat(120) + "\n")
            console.log(GeneralTable.toString())
            console.log(GeneralTable1.toString())
            console.log(GeneralTable2.toString())
            console.log(GeneralTable3.toString())
            console.log(GeneralTable4.toString())
            console.log(GeneralTable5.toString())


            //Base
            if (client.basecommands.size > 0 || client.baseevents.size > 0) console.log("=".repeat(120) + "\n" + "Base:" + "\n")
            if (client.basecommands.size > 0) {
                const BaseComandsTable = new Table({
                    head: ["Name:", "Description:"],
                    colWidths: [40, 40],
                    style: style,
                    chars: defaultLayout,
                    rowAligns: ["center", "center"],
                    colAligns: ["center", "center"]
                });

                client.basecommands.forEach(element => {
                    BaseComandsTable.push([element.name, element.data.description])
                });

                console.log(BaseComandsTable.toString())


            }

            if (client.baseevents.size > 0) {


                const BaseEventsTable = new Table({
                    head: ["Name:", "Tipo di evento:", "Allow:"],
                    style: style,
                    chars: defaultLayout,
                    rowAligns: ["center", "center", "center"],
                    colAligns: ["center", "center", "center"]
                });

                client.baseevents.forEach(element => {
                    BaseEventsTable.push([element.name, element.typeEvent, element.allowevents])
                });

                console.log(BaseEventsTable.toString())

            }


            //Distube
            if (client.distubecommands.size > 0 || client.distubeevents.size > 0) console.log("=".repeat(120) + "\n" + "Distube:" + "\n")
            if (client.distubecommands.size > 0) {

                const DistubeGeneralTable = new Table({
                    head: ["Name:", "Description:"],
                    style: style,
                    chars: defaultLayout,
                    rowAligns: ["center", "center"],
                    colAligns: ["center", "center"]
                });

                client.distubecommands.forEach(element => {
                    DistubeGeneralTable.push([element.name, element.data.description])
                });

                console.log(DistubeGeneralTable.toString())

            }

            if (client.distubeevents.size > 0) {

                const DistubeEventsTable = new Table({
                    head: ["Name:", "Tipo di evento:", "Allow:"],
                    style: style,
                    chars: defaultLayout,
                    rowAligns: ["center", "center", "center"],
                    colAligns: ["center", "center", "center"]
                });

                client.distubeevents.forEach(element => {
                    DistubeEventsTable.push([element.name, element.typeEvent, element.allowevents])
                });

                console.log(DistubeEventsTable.toString())

            }

            //Guilds
            if (client.guilds.cache.size > 0) console.log("=".repeat(120) + "\n" + "Guilds:" + "\n")
            if (client.guilds.cache.size > 0) {

                const GuildsTable = new Table({
                    head: ["Name:", "ID:"],
                    style: style,
                    chars: defaultLayout,
                    rowAligns: ["center", "center"],
                    colAligns: ["center", "center"]
                });

                client.guilds.cache.forEach(guild => {
                    GuildsTable.push([guild.name, guild.id])
                });
                console.log(GuildsTable.toString())

                console.log("=".repeat(120) + "\n")
            }


        } catch (err) { console.log(err) }
    }

}
module.exports = { LogStartup }