const fs = require("fs");
const { genericerr, disablefunctionembed } = require("../../../embeds/err/generic");
const { notpermisionmsgerr, tohigtmsgerr, nottoyou } = require("../../../embeds/err/command/permission");

module.exports = {
    name: "interactionCreate-commands",
    async execute(interaction) {
        try {
            if (!interaction.isChatInputCommand()) return;

            const command = client.commands.get(interaction.commandName)

            //Class
            class checks {
                constructor() {
                    this.owner = false;
                    this.sowner = false;
                    this.mbot = false;
                    this.staff = false;
                    this.perm = false;
                    this.you = false;
                    this.usposition = true;
                    this.botposition = true;
                    this.channel = false
                    this.pspecial = false;
                }
            }

            class conteniers {
                constructor() {
                    this.test = command.test;
                    this.execute = false;
                }
            }

            let check = new checks()

            let container = new conteniers()

            //check interaction.author
            // owner
            try {
                const ow = require("./../../../settings/onwer.json")
                for (let i in ow.onwerid)
                    if (interaction.member.id == ow.onwerid[i]) {
                        check.owner = true
                    }
            } catch {
                console.log("errore non ho potuto controllare l'owner")
            }

            // sowner
            if (interaction.member.id == interaction.guild.ownerId) {
                check.sowner = true
            }

            //check interaction.member
            if (interaction.options.getMember("user")) {

                // owner
                try {
                    const ow = require("./../../../settings/onwer.json")
                    for (let i in ow.onwerid)
                        if (interaction.options.getMember("user").id == ow.onwerid[i]) {
                            check.mowner = true
                        }
                } catch {
                    console.log("errore non ho potuto controllare l'owner")
                }

                // bot id 
                if (interaction.options.getMember("user").id == client.user.id) {
                    check.mbot = true
                }


                if (interaction.options.getMember("user").id == interaction.member.id) {
                    check.you = true
                }

            }

            if (container.test && !container.owner) {
                check.test = false
            }



            try {
                if (command.permisions.length == 0) {
                    check.perm = true
                } else {
                    command.permisions.forEach(per => {
                        if (interaction.member.permissions.has(per)) {
                            check.staff = true
                        }
                    });
                }
            } catch {
                console.log("errore non ho potuto controllare i permessi del comando")
                check.perm = true
            }



            if (command.position) {
                if (interaction.options.getMember("user")) {

                    if (interaction.member.roles.highest.position < interaction.options.getMember("user").roles.highest.position)
                        check.usposition = false
                    if (interaction.guild.members.cache.find(x => x.id == client.user.id).roles.highest.position < interaction.options.getMember("user").roles.highest.position)
                        check.botposition = false
                }
            }


            if (command.allowedchannels.size == 0) {
                check.channel = true
            } else {
                try {

                    command.allowedchannels.forEach(x => {
                        if (interaction.channel.id == x) {
                            return check.channel = true
                        }
                    })


                } catch {
                    console.log("errore non ho potuto controllare i canali del comando")
                    check.channel = true
                }
            }

            try {
                if (check.owner) {
                    const commandsFiles = fs.readdirSync(`./commands/bot/`);
                    for (const file of commandsFiles) {
                        var commands2 = require(`./../../../commands/bot/${file}`);
                        if (commands2.name == command.name) {
                            check.pspecial = true
                        }
                    }



                }


                if (check.owner && !check.you && !check.mbot && check.botposition) {
                    container.execute = true
                } else {
                    console.log(((check.staff || check.perm)), check.usposition, check.botposition, check.channel, !container.test, !check.you, !check.pspecial)
                    if (((check.staff || check.perm)) && check.usposition && check.botposition && check.channel && !container.test && !check.you && !check.pspecial) {
                        container.execute = true
                    }
                }



                if (container.execute) {
                    await command.execute(interaction)
                } else {
                    if (!check.owner && (!check.perm || !check.staff) || !check.channel)
                        return notpermisionmsgerr(interaction)
                    if (!check.owner && check.test)
                        return disablefunctionembed(interaction)
                    if ((!check.mbot || !check.owner) || !check.usposition || check.botposition)
                        return tohigtmsgerr(interaction)
                    if (check.you)
                        return nottoyou(interaction)
                }
            } catch { }


        } catch (err) {
            genericerr(interaction, err)
        }
    }
}