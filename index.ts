require("dotenv").config();
import { Client, Intents } from "discord.js";
import _ from "lodash";
import { colors, print } from "./Helpers";
const { NlpManager } = require("node-nlp");

const manager = new NlpManager({ languages: ["en"], forceNER: true });

//import the model
manager.load("./model.nlp");

const client = new Client({
  intents:
    Intents.FLAGS.GUILDS |
    Intents.FLAGS.GUILD_MESSAGES |
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS |
    Intents.FLAGS.DIRECT_MESSAGES |
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
});
const token = process.env.bot_token ?? "";

client.once("ready", (c) => {
  console.log(`Ready! Logged in as ${c?.user?.tag}`);
});

client.on("messageCreate", async (ctx) => {
  const {
    content,
    author: { username },
  } = ctx;
  console.log(`${colors.FgWhite}${username} : ${content}`);
  //prevent bot from responding to itself
  if (ctx.author.bot) return;

  const msg = String(content);

  //get NLG from model
  const response: RootObject = await manager.process("en", msg);

  //print confidence
  print(`${Math.round(response?.score * 100)}%`, "confidence");

  //reply using NLG
  ctx.reply(response?.answer ?? "I don't understand");
});

client.login(token);

//just some interface
interface RootObject {
  locale: string;
  utterance: string;
  settings: undefined;
  languageGuessed: boolean;
  localeIso2: string;
  language: string;
  nluAnswer: NluAnswer;
  classifications: Classification[];
  intent: string;
  score: number;
  domain: string;
  sourceEntities: any[];
  entities: any[];
  answers: any[];
  answer: undefined;
  actions: any[];
  sentiment: Sentiment;
}

interface Sentiment {
  score: number;
  numWords: number;
  numHits: number;
  average: number;
  type: string;
  locale: string;
  vote: string;
}

interface Classification {
  intent: string;
  score: number;
}

interface NluAnswer {
  classifications: Classification[];
  entities: undefined;
  explanation: undefined;
}
