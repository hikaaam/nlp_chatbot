import { Telegraf } from "telegraf";
import { colors, Logger, print } from "./Helpers";
require("dotenv").config();
const { NlpManager } = require("node-nlp");

const manager = new NlpManager({ languages: ["en"], forceNER: true });

//import the model
manager.load("./model.nlp");

const token = process.env.token ?? "";

const bot = new Telegraf(token);

bot.start((ctx) => {
  ctx.reply("Welcome, sir");
});

//set text listener from telegram
bot.on("text", Logger, async (ctx) => {
  const {
    message: { from, text, date },
  } = ctx;

  console.log(`${colors.FgGreen}${from.username} : ${text}`);

  //get nlg from model
  const response: RootObject = await manager.process("en", text);

  console.log(`${colors.FgMagenta}Bot : ${response.answer ?? "I don't understand"}`);

  //print confidence
  print(`${Math.round(response?.score * 100)}%`, "confidence");

  ctx.reply(response?.answer ?? "I don't understand");
});

bot.launch();

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
