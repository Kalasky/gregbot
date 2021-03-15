require("dotenv").config();
const tmi = require("tmi.js");
const API = require("call-of-duty-api")();
const { prefix } = require("./config.json");
const ChessWebAPI = require("chess-web-api");
const chessAPI = new ChessWebAPI();

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
  console.log("connected");
});

client.on("chat", (channel, user, message, self) => {
  // If the message doesn't start with the prefix, exit early.
  if (!message.startsWith(prefix)) return;

  switch (message) {
    case ">commands":
      client.action(
        "GregTheBoomer",
        `Here's a list of my commands: https://pastebin.com/V8Uv4AcH`
      );
      break;
    case ">help":
      client.action(
        "GregTheBoomer",
        `Here's a list of my commands: https://pastebin.com/V8Uv4AcH`
      );
      break;
    case ">rapidchess":
      chessAPI.getPlayerStats("GregTheBoomer").then(
        function (response) {
          let rapidWin = response.body.chess_rapid.record.win;
          let rapidLoss = response.body.chess_rapid.record.loss;
          let rapidDraw = response.body.chess_rapid.record.draw;
          let rapidBestRating = response.body.chess_rapid.best.rating;
          let rapidCurrentRating = response.body.chess_rapid.last.rating;
          client.action(
            "GregTheBoomer",
            `Greg's stats in Rapid: Wins: ${rapidWin} Losses: ${rapidLoss} Draws: ${rapidDraw} Current Elo: ${rapidCurrentRating} Best Elo: ${rapidBestRating}`
          );
        },
        function (err) {
          console.error(err);
        }
      );
      break;
    case ">blitzchess":
      chessAPI.getPlayerStats("GregTheBoomer").then(
        function (response) {
          let blitzWin = response.body.chess_blitz.record.win;
          let blitzLoss = response.body.chess_blitz.record.loss;
          let blitzDraw = response.body.chess_blitz.record.draw;
          let blitzBestRating = response.body.chess_blitz.best.rating;
          let blitzCurrentRating = response.body.chess_blitz.last.rating;
          client.action(
            "GregTheBoomer",
            `Greg's stats in Blitz: Wins: ${blitzWin} Losses: ${blitzLoss} Draws: ${blitzDraw} Current Elo: ${blitzCurrentRating} Best Elo: ${blitzBestRating}`
          );
        },
        function (err) {
          console.error(err);
        }
      );
      break;

    default:
      client.action(
        "GregTheBoomer",
        `Invalid command. Check out a list of valid commands here: https://pastebin.com/V8Uv4AcH`
      );
  }

  API.login(process.env.COD_EMAIL, process.env.COD_PASSWORD).then(() => {
    const id = "GregSC#21708";
    const platform = "battle";
    API.MWBattleData(id, platform)
      .then((wzData) => {
        let kd = wzData.br.kdRatio.toFixed(6).slice(0, -4);
        let kills = wzData.br.kills;
        let wins = wzData.br.wins;
        let topTen = wzData.br.topTen;
        let topFive = wzData.br.topFive;

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
            console.log("Invalid command");
        }
      })
      .catch((err) => {
        client.action("GregTheBoomer", `Error: ${err}`);
      });
  });
});
