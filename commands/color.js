require("dotenv").config();
const API = require("call-of-duty-api")();
const Discord = require("discord.js");
const { prefix } = require("../config.json");
const tmi = require("tmi.js");
var fetch = require("node-fetch");
const User = require("../models/user");

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

    // color embed
    const initialPromptEmbed = new Discord.MessageEmbed()
      .setColor("#00C5CD")
      .setTitle("Pick a color!")
      .setDescription(
        "If you have redeemed the color channel reward more than once, run this command again."
      )
      .addFields(
        { name: "🇦", value: "very slightly red", inline: true },
        { name: "🇧", value: "very slightly orange", inline: true },
        { name: "🇨", value: "very slightly yellow", inline: true },
        { name: "🇩", value: "very slightly green", inline: true },
        { name: "🇪", value: "very slightly blue", inline: true },
        { name: "🇫", value: "very slightly cyan", inline: true },
        { name: "🇬", value: "very slightly purple", inline: true },
        { name: "🇭", value: "very slightly brown", inline: true },
        { name: "🇮", value: "very slightly indigo", inline: true },
        { name: "🇯", value: "very slightly violet", inline: true },
        { name: "🇰", value: "very slightly pink", inline: true }
      )
      .setThumbnail("https://i.imgur.com/tpbXWeM.png")
      .setFooter("This embed will delete in 60 seconds!");

    let getRole = (roleString) => {
      // Find discord role object
      let role = message.guild.roles.cache.find((data) => {
        return data.name == roleString;
      });
      return role;
    };

    console.log(message.content);
    let twitchName = args[0];

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
        // console.log("reward:", reward);

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
              // initialize user doc in db
              User.findOneAndUpdate(
                { discordID: message.author.id },
                {
                  $set: {
                    vs_colors: [],
                    s_colors: [],
                    f_colors: [],
                    vs_colors_amount: 0,
                    s_colors_amount: 0,
                    f_colors_amount: 0,
                  },
                },
                { upsert: true },
                function callback(err) {
                  if (err) {
                    console.log(err);
                  }
                }
              );

              // gets all roles for current user
              memberData.guild.members.cache.find((role) => {
                // let roles = role.name;
                // console.log(role._roles);
                console.log(role);

                // arr.push(role.name);
                // console.log(arr);
                // const yoyo = Object.keys(role).map((data) => {
                //   return role[data][0];
                // });
                // console.log(yoyo);

                // let dataArray = [];
                // for (let o in role) {
                //   dataArray.push(role[o]);
                // }
                // console.log(dataArray);
              });

              message.channel.send(initialPromptEmbed).then((embed) => {
                embed.delete({ timeout: 60000 });
                embed
                  .react("🇦")
                  .then(() => embed.react("🇧"))
                  .then(() => embed.react("🇨"))
                  .then(() => embed.react("🇩"))
                  .then(() => embed.react("🇪"))
                  .then(() => embed.react("🇫"))
                  .then(() => embed.react("🇬"))
                  .then(() => embed.react("🇭"))
                  .then(() => embed.react("🇮"))
                  .then(() => embed.react("🇯"))
                  .then(() => embed.react("🇰"))
                  .catch(() =>
                    console.error("One of the emojis failed to react.")
                  );

                const filter = (reaction, user) => {
                  return (
                    [
                      "🇦",
                      "🇧",
                      "🇨",
                      "🇩",
                      "🇪",
                      "🇫",
                      "🇬",
                      "🇭",
                      "🇮",
                      "🇯",
                      "🇰",
                    ].includes(reaction.emoji.name) &&
                    user.id === message.author.id
                  );
                };

                embed
                  .awaitReactions(filter, {
                    max: 1,
                    time: 60000,
                    errors: ["time"],
                  })
                  .then((collected) => {
                    const reaction = collected.first();

                    switch (reaction.emoji.name) {
                      case "🇦":
                        // checking if user already has the role. if not then apply
                        if (
                          memberData.roles.cache.some(
                            (role) => role.name === "very slightly red"
                          )
                        ) {
                          embed.reply("You already have that role!");
                        } else {
                          memberData.roles.add(
                            getRole("very slightly red", message)
                          );
                          embed.reply("Role successfully applied!");
                        }

                        break;
                      case "🇧":
                        memberData.roles.add(
                          getRole("very slightly orange", message)
                        );
                        embed.reply("Role successfully applied!");
                        break;
                      case "🇨":
                        memberData.roles.add(
                          getRole("very slightly yellow", message)
                        );
                        embed.reply("Role successfully applied!");
                        break;
                      case "🇩":
                        memberData.roles.add(
                          getRole("very slightly green", message)
                        );
                        embed.reply("Role successfully applied!");
                        break;
                      case "🇪":
                        memberData.roles.add(
                          getRole("very slightly blue", message)
                        );
                        embed.reply("Role successfully applied!");
                        break;
                      case "🇫":
                        memberData.roles.add(
                          getRole("very slightly cyan", message)
                        );
                        embed.reply("Role successfully applied!");
                        break;
                      case "🇬":
                        memberData.roles.add(
                          getRole("very slightly purple", message)
                        );
                        embed.reply("Role successfully applied!");
                        break;
                      case "🇭":
                        memberData.roles.add(
                          getRole("very slightly brown", message)
                        );
                        embed.reply("Role successfully applied!");
                        break;
                      case "🇮":
                        memberData.roles.add(
                          getRole("very slightly indigo", message)
                        );
                        embed.reply("Role successfully applied!");
                        break;
                      case "🇯":
                        memberData.roles.add(
                          getRole("very slightly violet", message)
                        );
                        embed.reply("Role successfully applied!");
                        break;
                      case "🇰":
                        memberData.roles.add(
                          getRole("very slightly pink", message)
                        );
                        embed.reply("Role successfully applied!");
                        break;
                      default:
                        embed.reply("Oops. Something went wrong!");
                    }
                  })
                  .catch(() => {
                    embed.reply("You didn't leave a reaction in time!");
                  });
              });

              // after the color role is applied to user in discord, the user's channel point reward is set to FULFILLED
              fetch(
                `https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=58606718&reward_id=08d5e2d9-ddd7-4082-bc78-39b06b35cd68&id=${reward[i].id}`,
                {
                  method: "PATCH",
                  headers: {
                    "client-id": process.env.CLIENT_ID,
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ status: "FULFILLED" }),
                }
              );
              break;
              // send success embed client-side
            }

            // if (reward[i].user_name != twitchName) {
            //   message.channel.send(
            //     "You have no pending color role redemptions. Redeem the color channel point reward then try again."
            //   );
            // }
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
