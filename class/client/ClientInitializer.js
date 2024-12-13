import { Client, Partials } from "discord.js";
import { DisTube } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { DeezerPlugin } from "@distube/deezer";
import { YouTubePlugin } from "@distube/youtube";
import OpenAI from "openai";

import BotConsole from "../console/BotConsole.js";
import { ERROR_CODE } from "../error/ErrorHandler.js";
import JsonHandler from "../json/JsonHandler.js";
import systemcheck from "./SystemCheck.js";

class ClientInitializer {
  static MUSIC_FILTERS = Object.freeze({
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

  constructor() {
    this.jsonHandler = new JsonHandler();
  }

  async fetchConfig(endpoint) {
    try {
      const configUrl = `${systemcheck.getGithubConfig("urlrepo")}/${endpoint}`;
      return await this.jsonHandler.readFromUrl(
        configUrl,
        process.env.GITTOKEN
      );
    } catch (error) {
      throw ERROR_CODE.core.initialization.system.config;
    }
  }

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

      global.embedConfig = await this.fetchConfig("embed.json");
      BotConsole.success("Base client initialized successfully");
      return true;
    } catch (error) {
      throw ERROR_CODE.core.initialization.client.base;
    }
  }

  async initializeClientAI() {
    if (!process.env.OPENAITOKEN) {
      throw ERROR_CODE.core.initialization.client.ai;
    }

    try {
      global.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      BotConsole.success("AI client initialized successfully");
      return true;
    } catch (error) {
      throw ERROR_CODE.core.initialization.client.ai;
    }
  }

  async initializeClientDistube() {
    try {
      const cookies = await this.fetchConfig("cookies.json");

      global.distube = new DisTube(global.client, {
        emitNewSongOnly: false,
        emitAddSongWhenCreatingQueue: false,
        plugins: [
          new YouTubePlugin({ cookies: cookies.youtube }),
          new SoundCloudPlugin(),
          new SpotifyPlugin(),
          new DeezerPlugin(),
        ],
        customFilters: ClientInitializer.MUSIC_FILTERS,
      });

      BotConsole.success("Music client initialized successfully");
      return true;
    } catch (error) {
      throw ERROR_CODE.core.initialization.client.music;
    }
  }

  async initialize() {
    try {
      await this.initializeClientBase();

      const results = await Promise.allSettled([
        this.initializeClientDistube(),
        this.initializeClientAI(),
      ]);

      const status = {
        base: true,
        music: results[0].status === "fulfilled",
        ai: results[1].status === "fulfilled",
      };

      BotConsole.log("Client initialization status:", status);
      return status;
    } catch (error) {
      throw ERROR_CODE.system.error.handling;
    }
  }
}

export default new ClientInitializer();
