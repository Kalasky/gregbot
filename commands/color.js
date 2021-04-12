require("dotenv").config();
const API = require("call-of-duty-api")();
const Discord = require("discord.js");
const { prefix } = require("../config.json");
const tmi = require("tmi.js");
var fetch = require("node-fetch");

module.exports = {
  name: "color",
  syntax: ">color",
  description: "Pick a color!",
  include: true,
  args: true,
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

    let getRole = (roleString) => {
      // Find discord role object
      let role = message.guild.roles.cache.find((data) => {
        return data.name == roleString;
      });
      return role;
    };

    console.log(message.content);
    let color = args[0];
    let twitchName = args[1];
    console.log(color);

    async function myFetch() {
      let response = await fetch(
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
      );

      console.log("hhsdghsghds", response.json());
    }

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
        let reward = data.data;
        console.log("reward:", reward);

        /*
        - running through all created UNFULFILLED channel reward redemption and grabbing every user_input field
        - once logic runs through UNFULFILLED rewards, mark rewards as FULFILLED 
        */

        let wrapper = async () => {
          for (let i = 0; i < reward.length; i++) {
            console.log(reward[i].user_name);
            let memberData = await message.guild.members.fetch(
              message.author.id
            );

            // if agrs[1] (twitchName) matches up with one of the unfulfilled reward user_names apply role
            if (reward[i].user_name === twitchName) {
              memberData.roles.add(getRole("PLEB", message));
              message.channel.send("yorp");
              break;
              // send success embed client-side
            }
            // else if (reward[i].user_name != twitchName) {
            //   const nameError = new Discord.MessageEmbed()
            //     .setColor("#FF0000")
            //     .setTitle("Uh oh!")
            //     .setDescription(
            //       "You have not redeemed 'a very sligtly colored discored role' channel reward.\n\nYou must first redeem the reward for you role to be applied!"
            //     )
            //     .setThumbnail("https://i.imgur.com/I6hxLXI.png");
            //   message.channel.send(nameError);
            //   break;
            // }
          }
          return;
        };
        return wrapper();
      });
  },
};
