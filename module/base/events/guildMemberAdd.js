import BotConsole from "../../../class/console/BotConsole.js";
import SqlManager from "../../../class/Sql/SqlManager.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";
import welcomeImageService from "../../../class/services/WelcomeImageService.js";
import { Events, PermissionsBitField, time } from "discord.js";

export default {
    name: "NewMemberManager",
    eventType: Events.GuildMemberAdd,
    isActive: true,

    async execute(member) {
        const { guild, user } = member;
        const logPrefix = `[MemberAdd - ${guild.name}][${user.tag}]`;
        BotConsole.info(`${logPrefix} Si è unito al server.`);

        try {
            const syncResult = await this.synchronizeMember(member, logPrefix);
            const isRejoiningMember = syncResult.operation === 'exists';

            if (isRejoiningMember) {
                BotConsole.info(`${logPrefix} Rilevato come membro che rientra.`);
            }

            const rolesWereRestored = await this.handleRoleAssignment(member, logPrefix, isRejoiningMember);
            await this.sendWelcomeMessage(member, rolesWereRestored || isRejoiningMember, logPrefix);

        } catch (error) {
            BotConsole.error(`${logPrefix} Errore generale nell'evento guildMemberAdd.`, error);
        }
    },

    async synchronizeMember(member, logPrefix) {
        const memberName = member.user.globalName || member.displayName || member.user.username;
        await SqlManager.synchronizeGlobalMember({ id: member.id, globalName: memberName });
        const result = await SqlManager.ensureGuildMemberAssociation(member.guild.id, member.id);
        BotConsole.debug(`${logPrefix} Sincronizzazione DB utente/gilda completata.`);
        return result;
    },

    async handleRoleAssignment(member, logPrefix, isRejoiningMember) {
        if (member.user.bot) {
            await this.assignDefaultRole(member, 'bot', logPrefix);
            return false;
        }
        
        const restoredRoles = await this.restorePreviousRoles(member, logPrefix);

        if (restoredRoles.length > 0) {
            const roleNames = restoredRoles.map(r => `\`${r.name}\``).join(', ');
            const dmEmbed = new PresetEmbed({ guild: member.guild, member });
            await dmEmbed.init(true);
            dmEmbed.setTitle("Ruoli Ripristinati").setDescription(`Bentornato/a su **${member.guild.name}**! I tuoi ruoli precedenti sono stati ripristinati:\n${roleNames}`);
            await member.send({ embeds: [dmEmbed] }).catch(() => {});
            return true;
        }
        
        if (!isRejoiningMember) {
            await this.assignDefaultRole(member, 'user', logPrefix);
        }
        
        return false;
    },
    
    async restorePreviousRoles(member, logPrefix) {
        const dbRoles = await SqlManager.getRolesOfMember(member.id);
        const rolesInThisGuild = dbRoles.filter(r => r.IDGUILD === member.guild.id);
        if (rolesInThisGuild.length === 0) return [];
        const rolesToRestore = rolesInThisGuild.map(dbRole => member.guild.roles.cache.get(dbRole.ID)).filter(Boolean);
        const restoredRoles = [];
        for (const role of rolesToRestore) {
            if (this.canBotManageRole(member.guild, role, logPrefix)) {
                try {
                    await member.roles.add(role, "Ripristino ruoli precedenti.");
                    restoredRoles.push(role);
                } catch (e) { /* L'errore viene già loggato altrove */ }
            }
        }
        if (restoredRoles.length > 0) BotConsole.success(`${logPrefix} Ripristinati ${restoredRoles.length} ruoli.`);
        return restoredRoles;
    },

    async assignDefaultRole(member, type, logPrefix) {
        const guildConfig = await SqlManager.getGuildById(member.guild.id);
        const roleId = type === 'user' ? guildConfig?.ROLEDEFAULT_ID : guildConfig?.ROLEBOTDEFAULT_ID;
        if (!roleId) return;
        const role = member.guild.roles.cache.get(roleId);
        if (!role) return;
        if (this.canBotManageRole(member.guild, role, logPrefix)) {
            try {
                await member.roles.add(role, `Ruolo di default per ${type}.`);
                BotConsole.success(`${logPrefix} Assegnato ruolo di default: "${role.name}".`);
            } catch(e) { /* L'errore viene già loggato altrove */ }
        }
    },
    
    canBotManageRole(guild, role, logPrefix) {
        const botMember = guild.members.me;
        if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            BotConsole.warning(`${logPrefix} Il bot non ha il permesso 'Gestire Ruoli'.`);
            return false;
        }
        if (botMember.roles.highest.comparePositionTo(role) <= 0) {
            BotConsole.warning(`${logPrefix} Il bot non può gestire il ruolo "${role.name}" a causa della gerarchia.`);
            return false;
        }
        return true;
    },

    /**
     * Invia il messaggio di benvenuto con logica unificata e sofisticata.
     */
    async sendWelcomeMessage(member, isReturningMember, logPrefix) {
        const { guild, user, client } = member;
        
        const channel = await this._getWelcomeChannel(guild, logPrefix);
        if (!channel) return;
        
        // 1. Crea e inizializza l'embed. `init(true)` tenterà di usare un colore
        //    dinamico basato sull'avatar del membro, rendendo anche il fallback personalizzato.
        const welcomeEmbed = new PresetEmbed({ guild, member });
        await welcomeEmbed.init(true);

        // 2. Imposta il contenuto testuale, che è lo stesso in entrambi i casi.
        const welcomeTitle = isReturningMember ? `Bentornato/a, ${member.displayName}!` : `Benvenuto/a, ${member.displayName}!`;
        const description = `🎉 **${user.tag}** si è unito/a a **${guild.name}**!\nOra siamo in **${guild.memberCount}** membri!`;
        welcomeEmbed.setMainContent(welcomeTitle, description);

        // 3. Tenta di generare l'immagine personalizzata.
        await welcomeImageService.init()

        const imageResult = welcomeImageService ? await welcomeImageService.generate(member, guild.memberCount) : null;

        const messagePayload = { embeds: [welcomeEmbed] };

        // 4. Decora l'embed e prepara il payload finale
        if (imageResult?.attachment) {
            // SUCCESSO: Usa l'immagine generata e il suo colore dominante.
            welcomeEmbed
                .setImageUrl(`attachment://${imageResult.attachment.name}`)
                .setColor(imageResult.embedColorHex); // Sovrascrive il colore dell'avatar con quello dell'immagine
            messagePayload.files = [imageResult.attachment];
        } else {
            // FALLBACK: Usa il thumbnail dell'avatar. Il colore dinamico di init() viene mantenuto.
            if (welcomeImageService) BotConsole.warning(`${logPrefix} Generazione immagine fallita, invio embed di fallback sofisticato.`);
            
            welcomeEmbed
                .setThumbnailUrl(user.displayAvatarURL({ dynamic: true, size: 256 }))
                .addFieldBlock("Membro dal", time(user.createdAt, 'D')); // Aggiungiamo un campo extra
        }
        
        // 5. Invia il messaggio.
        await channel.send(messagePayload);
        BotConsole.success(`${logPrefix} Messaggio di benvenuto inviato.`);
    },

    /**
     * Helper per recuperare e validare il canale di benvenuto.
     */
    async _getWelcomeChannel(guild, logPrefix) {
        const guildConfig = await SqlManager.getGuildById(guild.id);
        if (!guildConfig?.WELCOME_ID) {
            BotConsole.info(`${logPrefix} Canale di benvenuto non configurato.`);
            return null;
        }
        const channel = await guild.channels.fetch(guildConfig.WELCOME_ID).catch(() => null);
        const requiredPerms = [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles];
        if (!channel?.isTextBased() || !channel.permissionsFor(guild.members.me).has(requiredPerms)) {
            BotConsole.warning(`${logPrefix} Canale di benvenuto (${guildConfig.WELCOME_ID}) non trovato o permessi mancanti.`);
            return null;
        }
        return channel;
    }
};