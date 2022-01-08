const { NlpManager } = require("node-nlp");
const datatrain: IDataTrain = require("./datasets/datatrain.json");
const sample: ISample = require("./datasets/sample.json");

const manager = new NlpManager({ languages: ["en"], forceNER: true });

//train from sample
sample.data.forEach(({ utterances, answers, intent }) => {
  //train the intents / topic
  utterances.forEach((utterance) => {
    manager.addDocument("en", utterance, intent);
  });
  
  //train the answer/nlg of a topic
  answers.forEach((answer) => {
    manager.addAnswer("en", intent, answer);
  });
});

//train the intents / topic
datatrain.topic.forEach(({ label, data }) => {
  data.forEach((sentence) => {
    manager.addDocument("en", sentence, label);
  });
});

//train the answer/nlg of a topic
datatrain.answer.forEach(({ label, data }) => {
  data.forEach((sentence) => {
    manager.addAnswer("en", label, sentence);
  });
});

(async () => {
  await manager.train();
  manager.save();
})();

interface IDataTrain {
  topic: Topic[];
  answer: Topic[];
}

interface Topic {
  label: string;
  data: string[];
}

interface ISample {
  name: string;
  locale: string;
  data: Datum[];
}

interface Datum {
  intent: string;
  utterances: string[];
  answers: string[];
}
