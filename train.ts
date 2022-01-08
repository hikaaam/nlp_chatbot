const { NlpManager } = require("node-nlp");
const sample: ISample = require("./datasets/samples.json");
const datatrain: IDataTrain = require("./datasets/datatrain.json");

const manager = new NlpManager({ languages: ["en"], forceNER: true });

//train from datatrain
datatrain.data.forEach(({ utterances, answers, intent }) => {
  //train the intents / topic
  utterances.forEach((utterance) => {
    manager.addDocument("en", utterance, intent);
  });

  //train the answer/nlg of a topic
  answers.forEach((answer) => {
    manager.addAnswer("en", intent, answer);
  });
});

//sample train the intents / topic
sample.topic.forEach(({ label, data }) => {
  data.forEach((sentence) => {
    manager.addDocument("en", sentence, label);
  });
});

//sample train the answer/nlg of a topic
sample.answer.forEach(({ label, data }) => {
  data.forEach((sentence) => {
    manager.addAnswer("en", label, sentence);
  });
});

(async () => {
  await manager.train();
  manager.save();
})();

interface ISample {
  topic: Topic[];
  answer: Topic[];
}

interface Topic {
  label: string;
  data: string[];
}

interface IDataTrain {
  name: string;
  locale: string;
  data: Datum[];
}

interface Datum {
  intent: string;
  utterances: string[];
  answers: string[];
}
