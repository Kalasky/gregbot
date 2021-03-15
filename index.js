require("dotenv").config();
const tmi = require("tmi.js");
const API = require("call-of-duty-api")();

const options = {
  options: { debug: true },
  connection: {
    cluster: "aws",
    reconnect: true,
  },
  identity: {
    username: "GregBot",
    password: process.env.AUTH_TOKEN,
  },
  channels: ["GregTheBoomer"],
};

const client = new tmi.client(options);

client.connect();

client.on("connected", (address, port) => {
  client.action("GregTheBoomer", "connected");
});

client.on("chat", (channel, user, message, self) => {
  API.login(process.env.COD_EMAIL, process.env.COD_PASSWORD).then(() => {
    const id = "Kalasky#1415";
    const platform = "battle";
    API.MWBattleData(id, platform)
      .then((wzData) => {
        let kd = wzData.br.kdRatio.toFixed(6).slice(0, -4);
        let kills = wzData.br.kills;
        let wins = wzData.br.wins;
        let topTen = wzData.br.topTen;
        let topFive = wzData.br.topFive;

        // if (message === ">wins") {
        //   client.action("GregTheBoomer", `Greg has ${expr} wins in Warzone`);
        // }

        switch (message) {
          case ">kills":
            client.action(
              "GregTheBoomer",
              `Greg has ${kills} kills in Warzone`
            );
            break;
          case ">wins":
            client.action("GregTheBoomer", `Greg has ${wins} wins in Warzone`);
            break;
          case ">kd":
            client.action(
              "GregTheBoomer",
              `Greg's kill death ratio is ${kd} in Warzone`
            );
            break;
          case ">top10":
            client.action(
              "GregTheBoomer",
              `Greg has finished top ten in ${topTen} games of Warzone`
            );
            break;
          case ">top5":
            client.action(
              "GregTheBoomer",
              `Greg has finished top five in ${topFive} games of Warzone`
            );
            break;

          default:
            console.log("invalid command");
        }
      })
      .catch((err) => {
        client.action("GregTheBoomer", `Error: ${err}`);
      });
  });
});
