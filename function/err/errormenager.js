const { ErrEmbed } = require("../../embed/err/errembed");
const { BotConsole } = require("../log/botConsole");
const prefix = 0x00000000;

class ErrorManager {

    constructor() {
        this.botconsole = new BotConsole();
    }

    async menagerError(interaction, error) {

        try {
            if (interaction && error.handler) {
                let errorEmbed = new ErrEmbed(interaction.guild, interaction.member);
                await errorEmbed.init().catch(() => { });
                let embed = await error.handler(errorEmbed).call(errorEmbed);

                if (interaction.replied) {
                    interaction.editReply({
                        embeds: [embed],
                        content: null
                    }).catch((err) => {
                        console.error(err);
                    });
                } else {
                    interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    }).catch((err) => {
                        console.error(err);
                    });
                }

                this.botconsole.log("Error code: " + error.code + " Message:" + error.message, "red");
            }
        } catch (error) {
            this.botconsole.log("Error: " + error, "red");
        }



    }
}

global.errorIndex = {
    REPLY_ERRORS: {
        GENERIC_ERROR: { code: prefix | 0, message: "Si è verificato un errore generico.", handler: errEmbed => errEmbed.getGenericError },
        NOT_PERMISSION_ERROR: { code: prefix | 1, message: "Non hai il permesso per eseguire questa azione.", handler: errEmbed => errEmbed.notPermissionError },
        CHANNEL_ERROR: { code: prefix | 2, message: "C'è stato un errore con il canale.", handler: errEmbed => errEmbed.ChannelError },
        WRONG_BUTTON_ERROR: { code: prefix | 3, message: "Il pulsante premuto non è valido.", handler: errEmbed => errEmbed.wrongButtonError },
        HIGH_PERMISSION_ERROR: { code: prefix | 4, message: "Hai permessi troppo alti per eseguire questa azione.", handler: errEmbed => errEmbed.highPermissionError },
        BOT_NOT_PERMISSION_ERROR: { code: prefix | 5, message: "Il bot non ha il permesso per eseguire questa azione.", handler: errEmbed => errEmbed.BotnotPermissionError },
        BOT_USER_ERROR: { code: prefix | 6, message: "C'è stato un errore con l'utente bot.", handler: errEmbed => errEmbed.botUserError },
        SELF_USER_ERROR: { code: prefix | 7, message: "Non puoi eseguire questa azione su te stesso.", handler: errEmbed => errEmbed.selfUserError },
        CHANNEL_NOT_FOUND_ERROR: { code: prefix | 8, message: "Il canale specificato non è stato trovato.", handler: errEmbed => errEmbed.ChannelnotFoundError },
        NOT_IN_VOICE_CHANNEL_ERROR: { code: prefix | 9, message: "Non sei in un canale vocale.", handler: errEmbed => errEmbed.notInVoiceChannelError },
        MUSIC_ALREADY_PLAYING_ERROR: { code: prefix | 10, message: "La musica è già in riproduzione.", handler: errEmbed => errEmbed.musicAlreadyPlayingError },
        NOT_TRACK_FOUND_ERROR: { code: prefix | 11, message: "Nessuna traccia trovata.", handler: errEmbed => errEmbed.nottrackfoundError },
        LIST_TRACK_ERROR: { code: prefix | 12, message: "C'è stato un errore nell'elencare le tracce.", handler: errEmbed => errEmbed.listtrackError },
        NOT_TRACK_SKIPABLE_ERROR: { code: prefix | 13, message: "La traccia non è saltabile.", handler: errEmbed => errEmbed.notrakskipableError },
        PLAYLIST_ERROR: { code: prefix | 14, message: "C'è stato un errore con la playlist.", handler: errEmbed => errEmbed.playlistError },
        NOT_PAUSE_ERROR: { code: prefix | 15, message: "La musica non può essere messa in pausa.", handler: errEmbed => errEmbed.notpauseError },
        PLAY_ERROR: { code: prefix | 16, message: "C'è stato un errore nella riproduzione della musica.", handler: errEmbed => errEmbed.playError },
        NOT_VOLUME_ERROR: { code: prefix | 17, message: "Il volume non può essere cambiato.", handler: errEmbed => errEmbed.notvolumeError },
        NOT_REPEAT_ERROR: { code: prefix | 18, message: "La traccia non può essere ripetuta.", handler: errEmbed => errEmbed.notrepeatError },
        NOT_STOP_ERROR: { code: prefix | 19, message: "La musica non può essere fermata.", handler: errEmbed => errEmbed.notstopError },
        NOT_SKIP_ERROR: { code: prefix | 20, message: "La traccia non può essere saltata.", handler: errEmbed => errEmbed.notskipError },
        NOT_RESUME_ERROR: { code: prefix | 21, message: "La musica non può essere ripresa.", handler: errEmbed => errEmbed.notresumeError },
        NOT_BAN_ERROR: { code: prefix | 22, message: "L'utente non può essere bannato.", handler: errEmbed => errEmbed.notbanError },
        NOT_KICK_ERROR: { code: prefix | 23, message: "L'utente non può essere espulso.", handler: errEmbed => errEmbed.notkickError },
        NOT_TIMEOUT_ERROR: { code: prefix | 24, message: "L'utente non può essere messo in timeout.", handler: errEmbed => errEmbed.nottimeoutError },
        IS_JUST_TIMEOUT_ERROR: { code: prefix | 25, message: "L'utente è già in timeout.", handler: errEmbed => errEmbed.isjusttimeoutError },
        NOT_UNTIMEOUT_ERROR: { code: prefix | 26, message: "L'utente non può essere rimosso dal timeout.", handler: errEmbed => errEmbed.notuntimeoutError },
        NOT_HAVE_TIMEOUT_ERROR: { code: prefix | 27, message: "L'utente non è in timeout.", handler: errEmbed => errEmbed.nothavetimeoutError },
        NOT_LIST_BAN_ERROR: { code: prefix | 28, message: "La lista dei ban non può essere recuperata.", handler: errEmbed => errEmbed.notlistbanerror },
        NOT_USER_FOUND_ERROR: { code: prefix | 29, message: "L'utente specificato non è stato trovato.", handler: errEmbed => errEmbed.notUserfoundError },
        EVAL_ERROR: { code: prefix | 30, message: "C'è stato un errore nella valutazione del comando.", handler: errEmbed => errEmbed.evaleError },
        OWNER_ERROR: { code: prefix | 31, message: "Questa azione può essere eseguita solo dal proprietario.", handler: errEmbed => errEmbed.ownerError },
        BULK_DELETE_ERROR: { code: prefix | 32, message: "C'è stato un errore nella cancellazione di massa dei messaggi.", handler: errEmbed => errEmbed.bulkdeleteError },
        BUTTON_NOT_VALID_ERROR: { code: prefix | 33, message: "Il pulsante non è valido.", handler: errEmbed => errEmbed.buttonnotvalidError },
        COMMAND_NOT_FOUND_ERROR: { code: prefix | 34, message: "Il comando non è stato trovato.", handler: errEmbed => errEmbed.CommandNotFountError },
        MEMBER_NOT_FOUND_ERROR: { code: prefix | 35, message: "Il membro specificato non è stato trovato.", handler: errEmbed => errEmbed.membernotfoundError },
    },
    SYSTEM_ERRORS: {
        FETCH_DATA_ERROR: { code: prefix | 36, message: "C'è stato un errore nel recupero dei dati." },
        UPDATE_EMOJI_ERROR: { code: prefix | 37, message: "C'è stato un errore nell'aggiornamento dell'emoji." },
        ADD_EMOJI_ERROR: { code: prefix | 38, message: "C'è stato un errore nell'aggiunta dell'emoji." },
        LOG_INIT_ERROR: { code: prefix | 39, message: "C'è stato un errore nell'inizializzazione del log." },
        UPDATE_RECEIVED_ERROR: { code: prefix | 40, message: "C'è stato un errore nell'aggiornamento dei dati ricevuti." },
        SERVER_START_ERROR: { code: prefix | 41, message: "C'è stato un errore nell'avvio del server." },
        GUILD_CONFIG_ERROR: { code: prefix | 42, message: "C'è stato un errore nella configurazione della gilda." },
        CHANNEL_SEND_ERROR: { code: prefix | 43, message: "C'è stato un errore nell'invio del messaggio." },
        READ_JSON_ERROR: { code: prefix | 44, message: "C'è stato un errore nella lettura del file JSON." },
        INIT_ERROR: { code: prefix | 45, message: "C'è stato un errore nell'inizializzazione." },
        BOOST_EVENT_ERROR: { code: prefix | 46, message: "C'è stato un errore nell'evento di boost." },
        WRITE_COMMAND_ERROR: { code: prefix | 47, message: "C'è stato un errore nella scrittura del comando." },
        FETCH_DATA_USER_ERROR: { code: prefix | 48, message: "C'è stato un errore nel recupero dei dati dell'utente." },
        FIND_EMOJI_ERROR: { code: prefix | 49, message: "C'è stato un errore nel trovare l'emoji." },
        GENERIC_ERROR: { code: prefix | 50, message: "Si è verificato un errore generico." },
        CREATE_JSON_ERROR: { code: prefix | 51, message: "C'è stato un errore nella creazione del file JSON." },
        SEND_MESSAGE_ERROR: { code: prefix | 52, message: "C'è stato un errore nell'invio del messaggio." },
        ADD_ROLE_ERROR: { code: prefix | 53, message: "C'è stato un errore nell'aggiunta del ruolo." },
    }
};


module.exports = {
    ErrorManager,
    errorIndex
};

