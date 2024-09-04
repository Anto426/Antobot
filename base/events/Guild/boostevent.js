const { EventEmbed } = require("../../../embed/base/events");

module.exports = {
    name: "BoostEvent",
    typeEvent: "guildMemberUpdate",
    allowevents: true,
    async execute(oldMember, newMember) {

        if (oldMember.premiumSince !== newMember.premiumSince) {
            let embedmsg = new EventEmbed(oldMember.guild, oldMember);
            embedmsg.init().then(() => {
                embedmsg.boostEvent(oldMember, newMember)
            }).catch((err) => {
                console.log(err);
            })
        }

    }
}
