const { randomChar, randomarrsort } = require("../random/random");
const cgame = require("./../../settings/games.json")


const { ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const { jsonddypendencebufferolyf } = require("../ddypendence/ddypendence");
function createrowmc(interaction, server) {

    let selectmenu = new StringSelectMenuBuilder()
        .setCustomId(`mc-${interaction.member.id}`)
        .setPlaceholder('Nothing selected')

    for (let temp in cgame.mc.server) {
        server.push(`${cgame.mc.server[temp].emoji} ${temp}`)
        selectmenu.addOptions([{
            label: `${cgame.mc.server[temp].emoji} ${temp}`,
            value: temp,

        }])
    }

    let row = new ActionRowBuilder()
        .addComponents(
            selectmenu
        );

    return row

}
function createrowgitol(interaction) {
    return new Promise((resolve, reject) => {

        let ex = []
        let selectmenu = new StringSelectMenuBuilder()
            .setCustomId(`ol-${interaction.member.id}`)
            .setPlaceholder('Nothing selected');


        try {
            jsonddypendencebufferolyf("https://raw.githubusercontent.com/anto624/Olimpiadi/main/InfoDatabase.json", process.env.GITTOKEN).then((data) => {
                const jsonData = JSON.parse(data);


                for (let temp in jsonData) {

                    ex.push(`${jsonData[temp].emoji} ${jsonData[temp].name} : ${jsonData[temp].score} ${jsonData[temp].livel}`);
                    selectmenu.addOptions([{
                        label: `${jsonData[temp].emoji} ${jsonData[temp].name} `,
                        value: temp,
                    }]);
                }

                const row = new ActionRowBuilder()
                    .addComponents(
                        selectmenu
                    );

                console.log(row);
                resolve({ row, ex });
            })

        } catch (error) {
            reject(error);
        }
    })
        .catch((error) => {
            console.error('Errore durante il download del file JSON:', error);
            reject(error);
        });
};

function createbottongitol(interaction, name) {
    let download = new ButtonBuilder()
        .setCustomId(`old-${interaction.member.id}-${name}`)
        .setLabel('Download')
        .setStyle(ButtonStyle.Danger);

    let row = new ActionRowBuilder()
        .addComponents(
            download
        );
    return row


};


function createrowbanner(interaction, member) {
    const bannerbotton = new ButtonBuilder()
        .setCustomId(`banner-${interaction.member.id}-${member.id}`)
        .setLabel('Banner')
        .setStyle(ButtonStyle.Success);

    let row = new ActionRowBuilder()
        .addComponents(
            bannerbotton
        );
    return row

}
function createrowavatar(interaction, member) {
    const avatarbotton = new ButtonBuilder()
        .setCustomId(`avatar-${interaction.member.id}-${member.id}`)
        .setLabel('Avatar')
        .setStyle(ButtonStyle.Success);

    let row = new ActionRowBuilder()
        .addComponents(
            avatarbotton
        );

    return row

}


function createrowstartcaptcha(member, capchatext) {

    const captchastartbotton = new ButtonBuilder()
        .setCustomId(`capchastart-${member.id}-${capchatext}`)
        .setLabel(`Start`)
        .setStyle(ButtonStyle.Success)

    let row = new ActionRowBuilder()
        .addComponents(
            captchastartbotton
        );

    return row

}

function createrowcaptcha(member, capchatext) {
    Textmatt = []
    for (let i = 0; i < 4; i++) {
        temp = ``;
        for (let z = 0; z < 5; z++)
            temp += randomChar();
        Textmatt.push(temp)
    }
    Textmatt.push(capchatext)
    randomarrsort(Textmatt)
    let row = new ActionRowBuilder()
    for (let i = 0; i < 5; i++) {
        let check = "f"
        if (Textmatt[i] == capchatext)
            check = "t"

        row.addComponents(
            new ButtonBuilder()
                .setCustomId(`capcha-${member.id}-${Textmatt[i]}-${check}`)
                .setLabel(Textmatt[i])
                .setStyle(ButtonStyle.Success)
        );
    }

    return row

}

function createrowstartchanneldelete() {

    const channelceleteboton = new ButtonBuilder()
        .setCustomId(`channeldelete`)
        .setLabel(`Canella il canale`)
        .setStyle(ButtonStyle.Danger)

    let row = new ActionRowBuilder()
        .addComponents(
            channelceleteboton
        );

    return row

}

function updaterowdisablebooton(oldrow) {

    let newrow = new ActionRowBuilder()
    oldrow.components.forEach(x => {
        newrow.addComponents(
            new ButtonBuilder()
                .setCustomId(`${x.customId}`)
                .setLabel(`${x.label}`)
                .setStyle(`${x.style}`)
                .setDisabled(true)
        );

    });

    return newrow

}

module.exports = { createrowmc, createrowbanner, createrowavatar, createrowstartcaptcha, createrowcaptcha, createrowstartchanneldelete, updaterowdisablebooton, createrowgitol, createbottongitol }