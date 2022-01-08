const nlp = require("node-nlp");
import { colors } from "./Helpers";
const manager_ = new nlp.NlpManager({ languages: ["en"], forceNER: true });

//import model
manager_.load("./model.nlp");

const test = [
 "who are you ?",
 "what about age ?",
 "what is your name ?",
 "where do you live",
 "who made you?",
 "what language are you made in ?",
 "what is your owner name?",
 "can you give your source code?",
];

//using test arrays to test the model
test.forEach(async (item: string) => {
  const response: RootObject = await manager_.process("en", item);
  console.log(
    `${
      response.score * 100 < 75 || response?.intent === "None"
        ? colors.FgRed
        : colors.FgGreen
    }\nWord: ${item}\nClassification: ${
      response?.intent
    }\nConfidence : ${Math.round(response?.score * 100)}%\nAnswer: ${
      response.answer
    }\nSentiment : ${response?.sentiment?.vote} (${Math.round(
      response?.sentiment?.score * 100
    )}%)`
  );
});


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
