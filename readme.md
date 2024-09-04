# 💻 Changelog per Anto's Bot v6.1.0 (Beta 2)

## Miglioramenti Generali

- **⚙️ Ottimizzazione dell'Avvio:** Migliorato il metodo di avvio per garantire prestazioni superiori.
- **🛠️ Caricamento Comandi ed Eventi:** Ottimizzato il modulo di caricamento per una gestione più efficiente.
- **🎨 Log di Avvio:** Rinnovato lo stile grafico del log di avvio per una visualizzazione più accattivante e dettagliata di tutti i moduli e gli eventi caricati.
- **📝 Log di Sistema:** Aggiornati per una tracciabilità e comprensione migliorate delle attività.
- **🎉 Gestione delle Festività:** Aggiornato il modulo per una gestione più precisa degli eventi festivi.
- **🛡️ Modulo Status:** Ottimizzato per garantire una visualizzazione accurata dello stato del bot.
- **🔒 Sicurezza:** Migliorata e ottimizzato il modulo di sicurezza per una maggiore affidabilità.
- **🤖 Integrazione OpenAI:** Aggiunto supporto alle API di OpenAI per funzionalità avanzate.
- **🎵 Supporto Distube:** Implementato il supporto a Distube per una gestione ottimale della riproduzione audio.
- **👋 Eventi Welcome e Left:** Aggiornati per conservare i vecchi ruoli degli utenti.
- **🔄 Aggiornamento Comandi ed Eventi:** Tutti i comandi e gli eventi sono stati aggiornati.
- **🖼️ Embed:** Riscritti tutti gli embed per una presentazione più coerente.

## Nuovi Comandi Aggiunti

### 🤖 Base Client
- 📜 **registercommand:** Registra un nuovo comando.
- 🤖 **botinfo:** Mostra le informazioni del bot.
- 🧹 **clear:** Cancella i messaggi in un canale.
- 👨‍💻 **developer:** Comando per ottenere le info sullo sviluppatore
- ❓ **help:** Mostra l'elenco dei comandi disponibili.
- 🏓 **ping:** Verifica la latenza del bot.
- 🏠 **serverinfo:** Mostra le informazioni del server.
- 🖼️ **useravatar:** Mostra l'avatar di un utente.
- 👤 **userinfo:** Mostra le informazioni di un utente.
- 🔨 **ban:** Bana un utente dal server.
- 👢 **kick:** Espelle un utente dal server.
- ⏳ **timeout:** Mette in timeout un utente.
- 🔓 **unban:** Revoca il ban di un utente.
- ⏱️ **untimeout:** Revoca il timeout di un utente.

### 🎵 Distube
- 🎵 **play:** Riproduce una traccia musicale.
- ▶️ **resume:** Riprende la riproduzione musicale.
- 🔁 **repeat:** Ripete la traccia musicale corrente.
- 🔊 **setvolume:** Imposta il volume della riproduzione musicale.
- ⏭️ **skip:** Salta la traccia musicale corrente.
- ⏹️ **stop:** Ferma la riproduzione musicale.

## Nuovi Eventi Aggiunti

### 🤖 Base Client
- ➕ **AddM:** Evento per l'aggiunta di un membro.
- ➖ **LeftM:** Evento per la rimozione di un membro.
- 🧹 **ClearChat:** Evento per cancellare la chat.
- 🎙️ **voiceStateUpdate:** Evento per aggiornare lo stato vocale.
- 📢 **Log channelCreate:** Evento per loggare la creazione di un canale.
- 📢 **Log channelDelete:** Evento per loggare la cancellazione di un canale.
- 📢 **Log channelUpdate:** Evento per loggare l'aggiornamento di un canale.
- 😀 **Log emojiCreate:** Evento per loggare la creazione di un'emoji.
- 😀 **Log emojiDelete:** Evento per loggare la cancellazione di un'emoji.
- 😀 **Log emojiUpdate:** Evento per loggare l'aggiornamento di un'emoji.
- 🔨 **Log guildBanAdd:** Evento per loggare l'aggiunta di un ban.
- 🔨 **Log guildBanRemove:** Evento per loggare la rimozione di un ban.
- 👥 **Log guildMemberAdd:** Evento per loggare l'aggiunta di un membro.
- 👥 **Log guildMemberRemove:** Evento per loggare la rimozione di un membro.
- 👥 **Log guildMemberUpdate:** Evento per loggare l'aggiornamento di un membro.
- 🏠 **Log guildUpdate:** Evento per loggare l'aggiornamento di una gilda.
- 🔗 **Log inviteCreate:** Evento per loggare la creazione di un invito.
- 🔗 **Log inviteDelete:** Evento per loggare la cancellazione di un invito.
- 🎭 **Log roleCreate:** Evento per loggare la creazione di un ruolo.
- 🎭 **Log roleDelete:** Evento per loggare la cancellazione di un ruolo.
- 🎭 **Log roleUpdate:** Evento per loggare l'aggiornamento di un ruolo.
- 🎙️ **Log voicestateupdate:** Evento per loggare l'aggiornamento dello stato vocale.
- ❓ **help:** Evento per mostrare l'elenco dei comandi disponibili.
- 🔓 **unban:** Evento per revocare il ban di un utente.


### 🎵 Distube
- ⚠️ **Error of Distube:** Evento per loggare gli errori di Distube.
- 📄 **log ffmpeg:** Evento per loggare ffmpeg.
- 🎵 **Play:** Evento per segnalare una traccia in riproduzione.
