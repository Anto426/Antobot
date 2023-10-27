
const { exoisembedint, exoisembedf } = require("../../../embeds/commands/general/olimpiadiembed");
const { notpermisionmsgerr } = require("../../../embeds/err/command/permission");
const { genericerr } = require("../../../embeds/err/generic");
const { checkvas } = require("../../../functions/check/check");
const { jsonddypendencebufferolyf, downloadAndCompressFolder } = require("../../../functions/ddypendence/ddypendence");
const { Cautor } = require("../../../functions/interaction/checkautorinteraction");
const { jsonras } = require("../../../functions/json/jsonf");
const { createrowgitol, createbottongitol } = require("../../../functions/row/createrow");
const fs = require("fs")
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        try {
            if (interaction.isChatInputCommand()) return;
            if (interaction.customId.split("-").includes("ol")) {
                if (Cautor(interaction)) {
                    if (checkvas(jsonras("./settings/whitelist.json"), interaction.member.id)) {
                        jsonddypendencebufferolyf("https://raw.githubusercontent.com/anto624/Olimpiadi/main/InfoDatabase.json", process.env.GITTOKEN).then((data) => {
                            const jsonData = JSON.parse(data);
                            let row = createbottongitol(interaction, jsonData[interaction.values[0]].name)
                            exoisembedint(interaction, row, jsonData[interaction.values[0]].emoji + " " + jsonData[interaction.values[0]].name, jsonData[interaction.values[0]].score, jsonData[interaction.values[0]].livel, jsonData[interaction.values[0]].author)
                            downloadAndCompressFolder("https://github.com/anto624/Olimpiadi", process.env.GITTOKEN, jsonData[interaction.values[0]].name)

                        })
                    } else {
                        notpermisionmsgerr(interaction)
                    }

                }

            }

            if (interaction.customId.split("-").includes("old")) {
                if (Cautor(interaction)) {
                    if (checkvas(jsonras("./settings/whitelist.json"), interaction.member.id) || checkv(jsonras("./settings/onwer.json"), interaction.member.id)) {
                        setTimeout(() => {
                            interaction.member.send({
                                content: "Spero di avervi aiutato, buona giornata",
                                files: [`${interaction.customId.split("-")[2]}.zip`]
                            })
                                .then(() => {
                                    fs.unlink(`${interaction.customId.split("-")[2]}.zip`, (err) => {
                                        if (err) {
                                            console.error('Errore nel cancellare il file:', err);
                                        } else {
                                            console.log('File cancellato con successo');
                                        }
                                    });
                                })
                                .catch((sendError) => {
                                    console.error('Errore nel inviare il mess:', sendError);
                                });

                            createrowgitol(interaction)
                                .then(({ row, ex }) => {
                                    exoisembedf(interaction, row, ex)
                                })

                        }, 500)
                    } else {
                        notpermisionmsgerr(interaction)
                    }
                }

            }

        } catch (err) { genericerr(interaction, err) }
    }
}



