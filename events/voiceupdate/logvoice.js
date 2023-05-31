const { logjoinvocalemed, logquitvocalembed, logchangevocalembed, logforcechangevocalembed } = require("../../embeds/voiceupdate/logvoiceembed")
const { AuditLogEvent } = require('discord.js');
let lasttimestap
module.exports = {
    name: "voiceStateUpdate",
    async execute(oldMember, newMember) {

        let member = newMember.guild.members.cache.get(newMember.id)
        try {

            if (newMember.channel != null && oldMember.channel == null) {
                logjoinvocalemed(member, newMember.channel)
            }


        } catch { }
        try {

            if (oldMember.channel != null && newMember.channel == null) {
                logquitvocalembed(member, oldMember.channel)
            }


        } catch { }

        try {




            if (oldMember.channelId !== newMember.channelId && newMember.channel !== null) {
                newMember.guild.fetchAuditLogs()
                    .then(async logs => {
                        let moveLog = logs.entries
                            .filter(e => e.action === AuditLogEvent.MemberMove)
                            .sort((a, b) => b.createdAt - a.createdAt)
                            .first()
                        if (moveLog.executor.id !== newMember.id && moveLog.createdTimestamp != lasttimestap) {
                            lasttimestap = await moveLog.createdTimestamp;
                            const executor = await newMember.guild.members.fetch(moveLog.executor.id);
                            logforcechangevocalembed(member, executor.user.tag, newMember.channel, oldMember.channel);
                        } else {
                            logchangevocalembed(member, newMember.channel, oldMember.channel);
                        }
                    })

            }
        } catch (error) {
            console.log(error);
        }
    }
}
