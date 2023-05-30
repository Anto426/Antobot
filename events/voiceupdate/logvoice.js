const { logquitvocal, logjoinvocal, logchangevocal, logforcechangevocal } = require("../../embeds/voiceupdate/logvoice")
const { AuditLogEvent, Events } = require('discord.js');
let lasttimestap
module.exports = {
    name: "voiceStateUpdate",
    async execute(oldMember, newMember) {

        let member = newMember.guild.members.cache.get(newMember.id)
        try {

            if (newMember.channel != null && oldMember.channel == null) {
                logjoinvocal(member, newMember.channel)
            }


        } catch { }
        try {

            if (oldMember.channel != null && newMember.channel == null) {
                logquitvocal(member, oldMember.channel)
            }


        } catch { }

        try {
            if (oldMember.channelId !== newMember.channelId && newMember.channel !== null) {
                const auditLogs = await newMember.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberMove });
                const lastAuditLog = auditLogs.entries.reduce((prev, current) => {
                    return (prev.createdTimestamp > current.createdTimestamp) ? prev : current;
                });
                const moveLog = lastAuditLog;

                if (moveLog && moveLog.executor.id !== newMember.id && moveLog.createdTimestamp != lasttimestap) {
                    lasttimestap = moveLog.createdTimestamp;
                    const executor = await newMember.guild.members.fetch(moveLog.executor.id);
                    logforcechangevocal(member, executor.user.tag, newMember.channel, oldMember.channel);
                } else {
                    logchangevocal(member, newMember.channel, oldMember.channel);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}
