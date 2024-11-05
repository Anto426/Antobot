const { ErrEmbed } = require("../../embed/err/errembed");
class ErrorManager {

    constructor() {
    }

    async getError(errorCode, guild, member) {
        const errEmbed = new ErrEmbed(guild, member);
        await errEmbed.init();
        const errorHandlers = [
            errEmbed.genericError,
            errEmbed.notPermissionError,
            errEmbed.ChannelError,
            errEmbed.wrongButtonError,
            errEmbed.highPermissionError,
            errEmbed.BotnotPermissionError,
            errEmbed.botUserError,
            errEmbed.selfUserError,
            errEmbed.ChannelnotFoundError,
            errEmbed.notInVoiceChannelError,
            errEmbed.musicAlreadyPlayingError,
            errEmbed.nottrackfoundError,
            errEmbed.listtrackError,
            errEmbed.notrakskipableError,
            errEmbed.playlistError,
            errEmbed.notpauseError,
            errEmbed.playError,
            errEmbed.notvolumeError,
            errEmbed.notrepeatError,
            errEmbed.notstopError,
            errEmbed.notskipError,
            errEmbed.notresumeError,
            errEmbed.notbanError,
            errEmbed.notkickError,
            errEmbed.nottimeoutError,
            errEmbed.isjusttimeoutError,
            errEmbed.notuntimeoutError,
            errEmbed.nothavetimeoutError,
            errEmbed.notlistbanerror,
            errEmbed.notUserfoundError,
            errEmbed.notbanError,
            errEmbed.evaleError,
            errEmbed.ownerError,
            errEmbed.bulkdeleteError,
            errEmbed.buttonnotvalidError,
            errEmbed.CommandNotFountError,
            errEmbed.membernotfoundError,
        ];

        return (errorHandlers[errorCode] || errEmbed.genericError).call(errEmbed);
    }

    async menagerError(interaction, errorCode) {
        const errorEmbed = await this.getError(errorCode);
        if (interaction.replied) {
            interaction.editReply({
                embeds: [errorEmbed],
                content: null
            }).catch((err) => {
                console.error(err);
            });
        } else {
            interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true
            }).catch((err) => {
                console.error(err);
            });
        }
    }
}


const errorIndex = {
    GENERIC_ERROR: { code: 0, message: "Si è verificato un errore generico.", internal: false },
    NOT_PERMISSION_ERROR: { code: 1, message: "Non hai il permesso per eseguire questa azione.", internal: false },
    CHANNEL_ERROR: { code: 2, message: "C'è stato un errore con il canale.", internal: false },
    WRONG_BUTTON_ERROR: { code: 3, message: "Il pulsante premuto non è valido.", internal: false },
    HIGH_PERMISSION_ERROR: { code: 4, message: "Hai permessi troppo alti per eseguire questa azione.", internal: false },
    BOT_NOT_PERMISSION_ERROR: { code: 5, message: "Il bot non ha il permesso per eseguire questa azione.", internal: false },
    BOT_USER_ERROR: { code: 6, message: "C'è stato un errore con l'utente bot.", internal: false },
    SELF_USER_ERROR: { code: 7, message: "Non puoi eseguire questa azione su te stesso.", internal: false },
    CHANNEL_NOT_FOUND_ERROR: { code: 8, message: "Il canale specificato non è stato trovato.", internal: false },
    NOT_IN_VOICE_CHANNEL_ERROR: { code: 9, message: "Non sei in un canale vocale.", internal: false },
    MUSIC_ALREADY_PLAYING_ERROR: { code: 10, message: "La musica è già in riproduzione.", internal: false },
    NOT_TRACK_FOUND_ERROR: { code: 11, message: "Nessuna traccia trovata.", internal: false },
    LIST_TRACK_ERROR: { code: 12, message: "C'è stato un errore nell'elencare le tracce.", internal: false },
    NOT_TRACK_SKIPABLE_ERROR: { code: 13, message: "La traccia non è saltabile.", internal: false },
    PLAYLIST_ERROR: { code: 14, message: "C'è stato un errore con la playlist.", internal: false },
    NOT_PAUSE_ERROR: { code: 15, message: "La musica non può essere messa in pausa.", internal: false },
    PLAY_ERROR: { code: 16, message: "C'è stato un errore nella riproduzione della musica.", internal: false },
    NOT_VOLUME_ERROR: { code: 17, message: "Il volume non può essere cambiato.", internal: false },
    NOT_REPEAT_ERROR: { code: 18, message: "La traccia non può essere ripetuta.", internal: false },
    NOT_STOP_ERROR: { code: 19, message: "La musica non può essere fermata.", internal: false },
    NOT_SKIP_ERROR: { code: 20, message: "La traccia non può essere saltata.", internal: false },
    NOT_RESUME_ERROR: { code: 21, message: "La musica non può essere ripresa.", internal: false },
    NOT_BAN_ERROR: { code: 22, message: "L'utente non può essere bannato.", internal: false },
    NOT_KICK_ERROR: { code: 23, message: "L'utente non può essere espulso.", internal: false },
    NOT_TIMEOUT_ERROR: { code: 24, message: "L'utente non può essere messo in timeout.", internal: false },
    IS_JUST_TIMEOUT_ERROR: { code: 25, message: "L'utente è già in timeout.", internal: false },
    NOT_UNTIMEOUT_ERROR: { code: 26, message: "L'utente non può essere rimosso dal timeout.", internal: false },
    NOT_HAVE_TIMEOUT_ERROR: { code: 27, message: "L'utente non è in timeout.", internal: false },
    NOT_LIST_BAN_ERROR: { code: 28, message: "La lista dei ban non può essere recuperata.", internal: false },
    NOT_USER_FOUND_ERROR: { code: 29, message: "L'utente specificato non è stato trovato.", internal: false },
    EVAL_ERROR: { code: 30, message: "C'è stato un errore nella valutazione del comando.", internal: true },
    OWNER_ERROR: { code: 31, message: "Questa azione può essere eseguita solo dal proprietario.", internal: false },
    BULK_DELETE_ERROR: { code: 32, message: "C'è stato un errore nella cancellazione di massa dei messaggi.", internal: false },
    BUTTON_NOT_VALID_ERROR: { code: 33, message: "Il pulsante non è valido.", internal: false },
    COMMAND_NOT_FOUND_ERROR: { code: 34, message: "Il comando non è stato trovato.", internal: false },
    MEMBER_NOT_FOUND_ERROR: { code: 35, message: "Il membro specificato non è stato trovato.", internal: false },
    // new errors
    FETCH_DATA_ERROR: { code: 36, message: "C'è stato un errore nel recupero dei dati.", internal: false },
    UPDATE_EMOJI_ERROR: { code: 37, message: "C'è stato un errore nell'aggiornamento dell'emoji.", internal: false },
    ADD_EMOJI_ERROR: { code: 38, message: "C'è stato un errore nell'aggiunta dell'emoji.", internal: false },
    LOG_INIT_ERROR: { code: 39, message: "C'è stato un errore nell'inizializzazione del log.", internal: false },
    UPDATE_RECEIVED_ERROR: { code: 40, message: "C'è stato un errore nell'aggiornamento dei dati ricevuti.", internal: false },
    SERVER_START_ERROR: { code: 41, message: "C'è stato un errore nell'avvio del server.", internal: false },
    GUILD_CONFIG_ERROR: { code: 42, message: "C'è stato un errore nella configurazione della gilda.", internal: false },
    CHANNEL_SEND_ERROR: { code: 43, message: "C'è stato un errore nell'invio del messaggio.", internal: false },
    READ_JSON_ERROR: { code: 44, message: "C'è stato un errore nella lettura del file JSON.", internal: false },
    INIT_ERROR: { code: 45, message: "C'è stato un errore nell'inizializzazione.", internal: false },
    BOOST_EVENT_ERROR: { code: 46, message: "C'è stato un errore nell'evento di boost.", internal: false },
    WRITE_COMMAND_ERROR: { code: 47, message: "C'è stato un errore nella scrittura del comando.", internal: false },
    FETCH_DATA_USER_ERROR: { code: 48, message: "C'è stato un errore nel recupero dei dati dell'utente.", internal: false },
    FIND_EMOJI_ERROR: { code: 49, message: "C'è stato un errore nel trovare l'emoji.", internal: false },
};

module.exports = {
    ErrorManager,
    errorIndex
};

