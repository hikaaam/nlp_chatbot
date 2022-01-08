## Instalation
- clone this repo
- create .env file `cp ./env.example .env`
- fill .env with your own credential
- `yarn install`

## How to run
- Run discord bot `yarn run discord`
- Run telegram bot `yarn run telegram`

## How to train the model with more data ?
- check on `datasets/datatrain.json` you can add your own intents/topics
> you can add dot to intents for continue the conversation<br>
> Q : what is your name ? `intent = agent.name`<br>
> Q : is that have any meaning ? `intent = agent.name.meaning`
- run `yarn run model-train` to train new data and generate new model
> model will be saved as `model.nlp`

## How to test the model accuracy ?
- on `modeltester.ts` add more sentence inside the test array
- run `yarn run model-test` to see the result
