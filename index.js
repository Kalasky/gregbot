require("dotenv").config();
require("./strategies/discord");
const express = require("express");
const passport = require("passport");
const app = express();
const routes = require("./routes");
const tmi = require("tmi.js");
const API = require("call-of-duty-api")();
const { prefix } = require("./config.json");
const ChessWebAPI = require("chess-web-api");
const chessAPI = new ChessWebAPI();
const mongoose = require("mongoose");
const session = require("express-session");
const Store = require("connect-mongo");
const cron = require("node-cron");

// let color = require("./commands/color");  -- color.execute(message);
const fs = require("fs");
const Discord = require("discord.js");
const dClient = new Discord.Client();
dClient.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  dClient.commands.set(command.name, command);
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB CONNECTION ERROR: ", err));

cron.schedule("*/10 * * * *", () => {
  fetch(
  'https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?first=50&broadcaster_id=107554430&reward_id=ac1c12ba-51da-4672-ba87-5dca61f2737e&status=UNFULFILLED',
  {
    headers: {
      "client-id": process.env.CLIENT_ID,
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  }
)
.then((res) => res.json())
.then((data) => {
  let reward = data.data;

  // successfully returns the only object that meets the requirement
  const mapReward = reward.map(yo => {
    const rewardDate = Date.parse(yo.redeemed_at);
    let hours = Math.abs(Date.now() - rewardDate) / 36e5;

    function round(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
  }

    yo.redeemed_at = round(hours, 1);
    return yo;
  });

  const result = mapReward.filter(x => x.redeemed_at >= 1.0);

  for (let i = 0; i < result.length; i++) {
    // console.log(result[i].id)
   async function fulfillReward() {
    await fetch(
      `https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=107554430&reward_id=ac1c12ba-51da-4672-ba87-5dca61f2737e&id=${result[i].id}`,
      {
        method: "PATCH",
        headers: {
          "client-id": process.env.CLIENT_ID,
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "CANCELED",
        }),
      }
    );
  }
  fulfillReward();
  }
 })
})

  dClient.on("ready", () => {
    dClient.user.setActivity('>help', { type: 'WATCHING' });

  // create custom reward
  // fetch("https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=107554430", {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  //       "client-Id": process.env.CLIENT_ID,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       title: "Discord Color Role",
  //       cost: "2000",
  //       prompt: "You must redeem this reward in Greg's discord server within an hour or your channel reward will automatically be cancelled and refunded. Run the command >help in Greg's discord server for more info!"
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data)
  //   })
  
  // fetch custom rewards from specified channel
  // fetch("https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=107554430&status=UNFULFILLED", {
  //     headers: {
  //       Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  //       "client-Id": process.env.CLIENT_ID,
  //     },
  //   })
  // .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data)
  //     })

  // get specified user:
  // fetch('https://api.twitch.tv/helix/search/channels?query=gregtheboomer', {
  //     headers: {
  //       Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  //       "client-Id": process.env.CLIENT_ID,
  //     },
  //   })
  // .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data)
  //     })
})

dClient.on("message", (message) => {  // If the message either doesn't start with the prefix or was sent by a bot, exit early.
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  // Create an args variable that slices off the prefix entirely and then splits it into an array by spaces.
  const args = message.content.slice(prefix.length).split(/ +/);
  // Create a command variable by calling args.shift(), which will take the first element in array and return
  // it while also removing it from the original array (to avoid having the command name string inside the args array).
  const commandName = args.shift().toLowerCase();

  if (!dClient.commands.has(commandName)) return;

  const command = dClient.commands.get(commandName);

  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply("I can't execute that command inside DMs!");
  }

  if (command.args && !args.length) {
    return message.channel.send(
      `You didn't provide any arguments, ${message.author}!`
    );
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.log(error);
    message.reply("there was an error trying to execute that command!");
  }
});

const options = {
  options: { debug: true },
  connection: { reconnect: true },
  identity: {
    username: "GregTheRobot",
    password: process.env.AUTH_TOKEN,
  },
  channels: ["GregTheBoomer"],
};

const client = new tmi.client(options);

client.connect();

client.on("connected", (address, port) => {
  console.log("connected");
});

const fetch = require("node-fetch");



// channel: String - Channel name
// userstate: Object - Userstate object
// message: String - Message received
// self: Boolean - Message was sent by the client
client.on("message", (channel, user, message, self) => {
  // If the message doesn't start with the prefix, exit early.
  if (!message.startsWith(prefix) || self) return;
  let msg = message.split(" ");

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
              function (res) {
                let rapidWin = res.body.chess_rapid.record.win;
                let rapidLoss = res.body.chess_rapid.record.loss;
                let rapidDraw = res.body.chess_rapid.record.draw;
                let rapidBestRating = res.body.chess_rapid.best.rating;
                let rapidCurrentRating = res.body.chess_rapid.last.rating;
                client.action(
                  "GregTheBoomer",

                  `Greg's stats in Rapid: Wins: ${rapidWin} Losses: ${rapidLoss} Draws: ${rapidDraw} Current Elo: ${rapidCurrentRating} Best Elo: ${rapidBestRating}`
                );
              },
              function (err) {
                console.log(err);

                client.action("GregTheBoomer", `${err}`);
              }
            );
            break;
          case ">blitzchess":
            chessAPI.getPlayerStats("GregTheBoomer").then(
              function (res) {
                let blitzWin = res.body.chess_blitz.record.win;
                let blitzLoss = res.body.chess_blitz.record.loss;
                let blitzDraw = res.body.chess_blitz.record.draw;
                let blitzBestRating = res.body.chess_blitz.best.rating;
                let blitzCurrentRating = res.body.chess_blitz.last.rating;
                client.action(
                  "GregTheBoomer",

                  `Greg's stats in Blitz: Wins: ${blitzWin} Losses: ${blitzLoss} Draws: ${blitzDraw} Current Elo: ${blitzCurrentRating} Best Elo: ${blitzBestRating}`
                );
              },
              function (err) {
                console.log(err);

                client.action("GregTheBoomer", `${err}`);
              }
            );
            break;
          case `>chess ${msg[1]}`:
            chessAPI.getPlayerStats(msg[1]).then(
              function (res) {
                // blitz
                let blitzWin = res.body.chess_blitz.record.win;
                let blitzLoss = res.body.chess_blitz.record.loss;
                let blitzDraw = res.body.chess_blitz.record.draw;
                let blitzBestRating = res.body.chess_blitz.best.rating;
                let blitzCurrentRating = res.body.chess_blitz.last.rating;
                // rapid
                let rapidWin = res.body.chess_rapid.record.win;
                let rapidLoss = res.body.chess_rapid.record.loss;
                let rapidDraw = res.body.chess_rapid.record.draw;
                let rapidBestRating = res.body.chess_rapid.best.rating;
                let rapidCurrentRating = res.body.chess_rapid.last.rating;
                client.action(
                  "GregTheBoomer",

                  `${msg[1]} Blitz stats: Wins: ${blitzWin} Losses: ${blitzLoss} Draws: ${blitzDraw} Current Elo: ${blitzCurrentRating} Best Elo: ${blitzBestRating} ---- ${msg[1]} Rapid stats: Wins: ${rapidWin} Losses: ${rapidLoss} Draws: ${rapidDraw} Current Elo: ${rapidCurrentRating} Best Elo: ${rapidBestRating}`
                );
              },
              function (err) {
                console.log(err);
                client.action(
                  "GregTheBoomer",

                  `${err} - Make sure the user exists and there is no misspelling`
                );
              }
            );
            break;

          default:
            console.log(
              "Invalid command. Check out a list of valid commands here: https://pastebin.com/V8Uv4AcH"
            );
        }
      })
      .catch((err) => {
        client.action("GregTheBoomer", `Error: ${err}`);
      });
  });
});

// cookie storage
app.use(
  session({
    secret: "secret",
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
    resave: false,
    saveUninitialized: false,
    store: Store.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routes);

app.listen(process.env.PORT || 3002, () =>
  console.log(`running on port ${process.env.PORT}`)
);

dClient.login(process.env.BOT_TOKEN);
