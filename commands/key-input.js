require("dotenv").config();
const API = require("call-of-duty-api")();
const Discord = require("discord.js");
const tmi = require("tmi.js");
var fetch = require("node-fetch");
const Key = require("../models/keys");

module.exports = {
  name: "setkeys",
  syntax: ">setkeys",
  description: "Set up your clientID and access key.",
  include: true,
  args: false,
  execute(message, args) {
    const options = {
      options: { debug: true },
      connection: {
        reconnect: true,
      },
      identity: {
        username: "GregBot",
        password: process.env.AUTH_TOKEN,
      },
      channels: ["kalaskyyy"],
    };

    const client = new tmi.client(options);

    client.connect();

    if (message.channel.type === "dm") {
      message.author.send(dmWarning);
      return;
    }

    const initialPromptEmbed = new Discord.MessageEmbed()
      .setColor("#00C5CD")
      .setTitle("Enter your Access Token and Client ID")
      .setDescription(
        "Get you Access Token and Client ID from https://twitchtokengenerator.com/\nSelect `Yes` on the following permissions: `chat_login` > `channel:read:redemptions` > `manage:redemptions`.\nClick `Gnerate Token!`. You will now see your Client ID and Access Token on the top of the web page."
      )
      .addFields(
        {
          name: "Where and how are my Client ID and Access Token being stored?",
          value:
            "Your Client ID and Access Token are salted, hashed, and then stored in a database.",
        },
        { name: "Syntax:", value: "`clientId accessToken`" }
      )
      .setThumbnail("https://i.imgur.com/tpbXWeM.png")
      .setFooter("We do not store login credentials.");

    message.author.send(initialPromptEmbed).then((data) => {
      let authorChannel = data.channel;
      const filter = (m) => message.author.id === m.author.id;

      authorChannel
        .awaitMessages(filter, {
          time: 120000,
          max: 1,
          errors: ["time"],
        })
        .then((messages) => {
          let messageContent = messages.first().content;
          let arrayIndex = messageContent.split(" ");
          let clientID = arrayIndex[0];
          let accessToken = arrayIndex[1];

          Key.create({
            clientID: clientID,
            accessToken: accessToken,
          }).catch((err) => {
            if (err) {
              console.log(err);
            }
          });
        });
    });
  },
};
