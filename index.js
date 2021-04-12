require("dotenv").config();
const tmi = require("tmi.js");
const API = require("call-of-duty-api")();
const { prefix } = require("./config.json");
const ChessWebAPI = require("chess-web-api");
const chessAPI = new ChessWebAPI();
const mongoose = require("mongoose");

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

dClient.on("message", (message) => {
  // If the message either doesn't start with the prefix or was sent by a bot, exit early.
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
    console.error(error);
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
  channels: ["kalaskyyy"],
};

const client = new tmi.client(options);

client.connect();

client.on("connected", (address, port) => {
  console.log("connected");
});

var fetch = require("node-fetch");
// dClient.on("ready", () => {
fetch(
  // fetch all custom channel point rewards
  // https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=58606718&status=UNFULFILLED

  // lists custom reward redemptions for a specific reward
  // https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=58606718&reward_id=9591e009-bdc6-434d-aa05-3481b4746b46&status=UNFULFILLED

  "https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=58606718&reward_id=08d5e2d9-ddd7-4082-bc78-39b06b35cd68&status=UNFULFILLED",
  {
    headers: {
      "client-id": process.env.CLIENT_ID,
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  }
)
  .then((res) => res.json())
  .then((data) => {
    // targeting hard coded guild ID

    let reward = data.data;
    console.log("reward:", reward);

    /*
      - running through all created UNFULFILLED channel reward redemption and grabbing every user_input field
      - once logic runs through UNFULFILLED rewards, mark rewards as FULFILLED 
      */
    // reward.forEach((rewards) => console.log(rewards.user_input));

    // const guild = dClient.guild.cache.get("455697668975362049");
    // var role = guild.roles.cache.find((role) => role.name === "PLEB");
    // // guild.members.cache.get("220820279667064832").roles.add(role);

    // dClient.guild.members.fetch("220820279667064832").then((memberData) => {
    //   memberData.roles.add(getRole("PLEB", dClient));
    // });
  });
// });

fetch(
  "https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=58606718",
  {
    method: "POST",
    headers: {
      "client-id": process.env.CLIENT_ID,
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "test creation3",
      cost: 50000,
      is_user_input_required: true,
      prompt: "Enter in your Discord username including the id",
    }),
  }
);

client.on("message", (channel, user, message, self) => {
  // If the message doesn't start with the prefix, exit early.
  if (!message.startsWith(prefix) || self) return;

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
            client.action("kalaskyyy", `Greg has ${kills} kills in Warzone`);
            break;
          case ">wins":
            client.action("kalaskyyy", `Greg has ${wins} wins in Warzone`);
            break;
          case ">kd":
            client.action(
              "kalaskyyy",
              `Greg's kill death ratio is ${kd} in Warzone`
            );
            break;
          case ">top10":
            client.action(
              "kalaskyyy",
              `Greg has finished top ten in ${topTen} games of Warzone`
            );
            break;
          case ">top5":
            client.action(
              "kalaskyyy",
              `Greg has finished top five in ${topFive} games of Warzone`
            );
          case ">commands":
            client.action(
              "kalaskyyy",
              `Here's a list of my commands: https://pastebin.com/V8Uv4AcH`
            );
            break;
          case ">help":
            client.action(
              "kalaskyyy",
              `Here's a list of my commands: https://pastebin.com/V8Uv4AcH`
            );
            break;
          case ">rapidchess":
            chessAPI.getPlayerStats("kalaskyyy").then(
              function (response) {
                let rapidWin = response.body.chess_rapid.record.win;
                let rapidLoss = response.body.chess_rapid.record.loss;
                let rapidDraw = response.body.chess_rapid.record.draw;
                let rapidBestRating = response.body.chess_rapid.best.rating;
                let rapidCurrentRating = response.body.chess_rapid.last.rating;
                client.action(
                  "kalaskyyy",
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
                  "kalaskyyy",
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
              "kalaskyyy",
              `Invalid command. Check out a list of valid commands here: https://pastebin.com/V8Uv4AcH`
            );
        }
      })
      .catch((err) => {
        client.action("kalaskyyy", `Error: ${err}`);
      });
  });
});

dClient.login(process.env.BOT_TOKEN);
