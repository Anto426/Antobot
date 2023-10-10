
const { exoisembedint, exoisembedf } = require("../../../embeds/commands/general/olimpiadiembed");
const { genericerr } = require("../../../embeds/err/generic");
const { jsonddypendencebufferolyf, downloadAndCompressFolder } = require("../../../functions/ddypendence/ddypendence");
const { Cautor } = require("../../../functions/interaction/checkautorinteraction");
const { createrowgitol, createrowbanner, createbottongitol } = require("../../../functions/row/createrow");
const fs = require("fs")
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        try {
            if (interaction.isChatInputCommand()) return;
            if (interaction.customId.split("-").includes("ol")) {
                if (Cautor(interaction)) {
                    jsonddypendencebufferolyf("https://raw.githubusercontent.com/anto624/Olimpiadi/main/InfoDatabase.json", process.env.GITTOKEN).then((data) => {
                        const jsonData = JSON.parse(data);
                        let row = createbottongitol(interaction, jsonData[interaction.values[0]].name)
                        exoisembedint(interaction, row, jsonData[interaction.values[0]].emoji + " " + jsonData[interaction.values[0]].name, jsonData[interaction.values[0]].score, jsonData[interaction.values[0]].livel, jsonData[interaction.values[0]].author)
                        downloadAndCompressFolder("https://github.com/anto624/Olimpiadi", process.env.GITTOKEN, jsonData[interaction.values[0]].name)

                    })

                    console.log(interaction.values)

                }

            }

            if (interaction.customId.split("-").includes("old")) {
                if (Cautor(interaction)) {
                    setTimeout(() => {
                        interaction.member.send({
                            content: "Spero di avervi aiutato, buona giornata",
                            files: [`${interaction.customId.split("-")[2]}.zip`]
                        })
                            .then(() => {
                                fs.unlink(`${interaction.customId.split("-")[2]}.zip`, (err) => {
                                    if (err) {
                                        console.error('Error deleting the file:', err);
                                    } else {
                                        console.log('File deleted successfully');
                                    }
                                });
                            })
                            .catch((sendError) => {
                                console.error('Error sending message:', sendError);
                            });

                        createrowgitol(interaction)
                            .then(({ row, ex }) => {
                                exoisembedf(interaction, row, ex)
                            })

                    }, 500)
                }

            }

        } catch (err) { genericerr(interaction, err) }
    }
}



