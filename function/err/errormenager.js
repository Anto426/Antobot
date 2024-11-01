const { ErrEmbed } = require("../../embed/err/errembed");
class ErrorManager {

    constructor(guild, member) {
        this.guild = guild;
        this.member = member;
    }

    async getError(errorCode) {
        const errEmbed = new ErrEmbed(this.guild, this.member);
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

    async replyError(interaction, errorCode) {
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
    GENERIC_ERROR: 0,
    NOT_PERMISSION_ERROR: 1,
    CHANNEL_ERROR: 2,
    WRONG_BUTTON_ERROR: 3,
    HIGH_PERMISSION_ERROR: 4,
    BOT_NOT_PERMISSION_ERROR: 5,
    BOT_USER_ERROR: 6,
    SELF_USER_ERROR: 7,
    CHANNEL_NOT_FOUND_ERROR: 8,
    NOT_IN_VOICE_CHANNEL_ERROR: 9,
    MUSIC_ALREADY_PLAYING_ERROR: 10,
    NOT_TRACK_FOUND_ERROR: 11,
    LIST_TRACK_ERROR: 12,
    NOT_TRACK_SKIPABLE_ERROR: 13,
    PLAYLIST_ERROR: 14,
    NOT_PAUSE_ERROR: 15,
    PLAY_ERROR: 16,
    NOT_VOLUME_ERROR: 17,
    NOT_REPEAT_ERROR: 18,
    NOT_STOP_ERROR: 19,
    NOT_SKIP_ERROR: 20,
    NOT_RESUME_ERROR: 21,
    NOT_BAN_ERROR: 22,
    NOT_KICK_ERROR: 23,
    NOT_TIMEOUT_ERROR: 24,
    IS_JUST_TIMEOUT_ERROR: 25,
    NOT_UNTIMEOUT_ERROR: 26,
    NOT_HAVE_TIMEOUT_ERROR: 27,
    NOT_LIST_BAN_ERROR: 28,
    NOT_USER_FOUND_ERROR: 29,
    EVAL_ERROR: 30,
    OWNER_ERROR: 31,
    BULK_DELETE_ERROR: 32,
    BUTTON_NOT_VALID_ERROR: 33,
    COMMAND_NOT_FOUND_ERROR: 34,
    MEMBER_NOT_FOUND_ERROR: 35
};

module.exports = {
    ErrorManager,
    errorIndex
};

