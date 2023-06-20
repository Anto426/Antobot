
const { botmsgerr } = require("../../embeds/err/command/permission");
const { mutembeds, mutembede } = require("../../embeds/moderation/muteembed");
const { timeoutembede, timeoutembeds, untimeoutembeds, untimeoutembede } = require("../../embeds/moderation/timeoutembed");


async function timeoutf(interaction, member, time, reason) {
    if (member.user.bot) {
        botmsgerr(interaction)
    }
    if (member.communicationDisabledUntilTimestamp == null || member.communicationDisabledUntilTimestamp < Date.now()) {

        member.timeout(time, reason).then(() => {

            timeoutembeds(interaction, member, reason)

        }).catch(() => {
            errmsg.genericmsg(interaction)
            return
        })




    } else {
        const d = new Date(member.communicationDisabledUntilTimestamp);
        date = d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();
        timeoutembede(interaction, member, reason)
        console.log(date);

    }
}

async function untimioutf(interaction, member,) {
    if (member.user.bot) {
        errmsg.botmsg(interaction)
        return interaction.reply({ embeds: [embed] })

    }

    if (member.communicationDisabledUntilTimestamp != null || member.communicationDisabledUntilTimestamp > Date.now()) {
        member.timeout(null)
        untimeoutembeds(interaction, member)

    } else {
        untimeoutembede(interaction, member)
    }
}


module.exports = {
    timeoutf,
    untimioutf

}