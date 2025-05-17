import { Client, Partials } from "discord.js";
import { DisTube } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { DeezerPlugin } from "@distube/deezer";
import { YouTubePlugin } from "@distube/youtube";
import OpenAI from "openai";
import BotConsole from "../console/BotConsole.js";
import SystemCheck from "./SystemCheck.js";

// === Costanti ===
const MUSIC_FILTERS = Object.freeze({
  bassboost: "bass=g=10",
  "8D": "apulsator=hz=0.08",
  vaporwave: "aresample=48000,asetrate=48000*0.8",
  nightcore: "aresample=48000,asetrate=48000*1.25",
  phaser: "aphaser=in_gain=0.4",
  tremolo: "tremolo",
  vibrato: "vibrato=f=6.5",
  reverse: "areverse",
  treble: "treble=g=5",
  normalizer: "dynaudnorm=g=101",
  surrounding: "surround",
  pulsator: "apulsator=hz=1",
  subboost: "asubboost",
  karaoke: "stereotools=mlev=0.03",
  flanger: "flanger",
  gate: "agate",
  haas: "haas",
  mcompand: "mcompand",
  earwax: "earwax",
});

class ClientInitializer {
  #cookies;

  async initializeClientBase() {
    try {
      global.client = new Client({
        intents: 3276799,
        partials: Object.values(Partials),
        allowedMentions: {
          parse: ["roles", "users", "everyone"],
          repliedUser: true,
        },
      });
      BotConsole.success("Base client initialized successfully");
      return true;
    } catch (error) {
      BotConsole.error("Failed to initialize base client:", error);
      throw error;
    }
  }

  async initializeClientAI() {
    if (!SystemCheck.isFeatureEnabled("openai")) {
      BotConsole.info("AI client is disabled in config");
      return false;
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI token not found");
    }

    try {
      global.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      BotConsole.success("AI client initialized successfully");
      return true;
    } catch (error) {
      BotConsole.error("Failed to initialize AI client:", error);
      throw error;
    }
  }

  async initializeClientDistube() {
    if (!SystemCheck.isFeatureEnabled("music")) {
      BotConsole.info("Music client is disabled in config");
      return false;
    }

    try {
      global.distube = new DisTube(global.client, {
        emitNewSongOnly: false,
        emitAddSongWhenCreatingQueue: false,
        plugins: [
          new YouTubePlugin({ cookies: this.cookies.youtube }),
          new SoundCloudPlugin(),
          new SpotifyPlugin(),
          new DeezerPlugin(),
        ],
        customFilters: MUSIC_FILTERS,
      });
      BotConsole.success("Music client initialized successfully");
      return true;
    } catch (error) {
      BotConsole.error("Failed to initialize music client:" + error);
      throw error;
    }
  }

  setCookies(cookies) {
    this.cookies = cookies.youtube;
  }

  async initialize() {
    try {
      await this.initializeClientBase();

      const [musicResult, aiResult] = await Promise.allSettled([
        this.initializeClientDistube(),
        this.initializeClientAI(),
      ]);

      const status = {
        base: true,
        music: musicResult.status === "fulfilled" && musicResult.value,
        ai: aiResult.status === "fulfilled" && aiResult.value,
      };

      BotConsole.info("Client initialization status:", status);
      return status;
    } catch (error) {
      BotConsole.error("Failed to initialize clients:", error);
      throw error;
    }
  }
}

export default ClientInitializer;
