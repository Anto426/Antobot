
const { botmsgerr } = require("../../embeds/err/command/permission");
const { genericerr } = require("../../embeds/err/generic");
const { mutembeds, mutembede } = require("../../embeds/moderation/muteembed");
const { timeoutembede, timeoutembeds, untimeoutembeds, untimeoutembede } = require("../../embeds/moderation/timeoutembed");


async function timeoutf(interaction, member, time, reason) {


    try {
        if (member.user.bot) {
            botmsgerr(interaction)
        }
        if (member.communicationDisabledUntilTimestamp == null || member.communicationDisabledUntilTimestamp < Date.now()) {

            member.timeout(time, reason).then(() => {

                return timeoutembeds(interaction, member, reason, time)

            }).catch((err) => {
                genericerr(interaction, err)
                return
            })

        } else {
            const d = new Date(member.communicationDisabledUntilTimestamp);
            date = d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();
            return timeoutembede(interaction, member, date)

        }
    } catch (err) { genericerr(interaction, err) }
}

async function untimioutf(interaction, member) {


    try {
        if (member.user.bot) {
            return botmsgerr(int)
        }
        if (member.communicationDisabledUntilTimestamp != null || member.communicationDisabledUntilTimestamp > Date.now()) {
            member.timeout(null)
            untimeoutembeds(interaction, member)

        } else {
            untimeoutembede(interaction, member)
        }
    } catch (err) { genericerr(interaction, err) }
}


module.exports = {
    timeoutf,
    untimioutf

}