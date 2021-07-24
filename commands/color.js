require("dotenv").config();
const API = require("call-of-duty-api")();
const Discord = require("discord.js");
const { prefix } = require("../config.json");
const tmi = require("tmi.js");
const fetch = require("node-fetch");
const User = require("../models/user");
const vs_json = require("../vs_colors.json");
const s_json = require("../s_colors.json");

module.exports = {
  name: "color",
  syntax: ">color",
  description: "Pick a color!",
  include: true,
  args: true,
  cooldown: 10,
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
      channels: ["gregtheboomer"],
    };

    const client = new tmi.client(options);

    client.connect();

    const dmWarning = new Discord.MessageEmbed()
      .setColor("#FF0000")
      .setTitle("This command must be executed in a server.")

      .setThumbnail("https://i.imgur.com/I6hxLXI.png");

    if (message.channel.type === "dm") {
      message.author.send(dmWarning);
      return;
    }

    // very slight color (vs_color) embed
    const initialPromptEmbed = new Discord.MessageEmbed()
      .setColor("#00C5CD")
      .setTitle(`Pick a color ${message.author.username}!`)
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

    // slight color (s_color) embed
    const slightColorEmbed = new Discord.MessageEmbed()
      .setColor("#00C5CD")
      .setTitle(`Pick a color ${message.author.username}!`)
      .setDescription(
        "You have obtained all of the very slight colors!\nTrade in all of your very slight colors by selecting a slight color below.\nIf you would like to choose a slight color some other time feel free to ignore this prompt, it will end automatically."
      )
      .addFields(
        { name: "🇦", value: "slightly red", inline: true },
        { name: "🇧", value: "slightly orange", inline: true },
        { name: "🇨", value: "slightly yellow", inline: true },
        { name: "🇩", value: "slightly green", inline: true },
        { name: "🇪", value: "slightly blue", inline: true },
        { name: "🇫", value: "slightly cyan", inline: true },
        { name: "🇬", value: "slightly purple", inline: true },
        { name: "🇭", value: "slightly brown", inline: true },
        { name: "🇮", value: "slightly indigo", inline: true },
        { name: "🇯", value: "slightly violet", inline: true },
        { name: "🇰", value: "slightly pink", inline: true }
      )
      .setThumbnail("https://i.imgur.com/tpbXWeM.png")
      .setFooter("This embed will delete in 60 seconds!");

    // full color (f_color) embed
    const fullColorEmbed = new Discord.MessageEmbed()
      .setColor("#00C5CD")
      .setTitle(`Pick a color ${message.author.username}!`)
      .setDescription(
        "You have obtained all of the slight colors!\nTrade in all of your slight colors by selecting a slight color below.\nIf you would like to choose a full color some other time feel free to ignore this prompt, it will end automatically."
      )
      .addFields(
        { name: "🇦", value: "red", inline: true },
        { name: "🇧", value: "orange", inline: true },
        { name: "🇨", value: "yellow", inline: true },
        { name: "🇩", value: "green", inline: true },
        { name: "🇪", value: "blue", inline: true },
        { name: "🇫", value: "cyan", inline: true },
        { name: "🇬", value: "purple", inline: true },
        { name: "🇭", value: "brown", inline: true },
        { name: "🇮", value: "indigo", inline: true },
        { name: "🇯", value: "violet", inline: true },
        { name: "🇰", value: "pink", inline: true }
      )
      .setThumbnail("https://i.imgur.com/tpbXWeM.png")
      .setFooter("This embed will delete in 60 seconds!");

    console.log(message.content);
    let twitchName = args[0];

    const congratsEmbed = new Discord.MessageEmbed()
      .setColor("#FF69B4")
      .setTitle(`Congratulations ${message.author.username}!`)
      .setDescription(
        "You have obtained all of the full colors! The rainbow is all yours.\n\nEnjoy this rainbow unicorn!"
      )
      .setThumbnail(
        "https://thumbs.gfycat.com/EarnestUnrealisticIrishsetter-max-1mb.gif"
      );

    const nameError = new Discord.MessageEmbed()
      .setColor("#FF0000")
      .setTitle(`Uh oh, ${message.author.username}!`)
      .setDescription(
        "If your name is spelled correctly you have not redeemed the 'Discord Color Role' channel reward.\n\nMake sure you are verified! Run the command `>verify` to get started.\n\nIf you can't get verified, make sure your Twitch account is connected to your Discord account."
      )
      .setThumbnail("https://i.imgur.com/I6hxLXI.png");

    function inValid() {
      message.channel.send(nameError);
    }

    fetch(
      `https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?first=50&broadcaster_id=107554430&reward_id=ac1c12ba-51da-4672-ba87-5dca61f2737e&status=UNFULFILLED`,
      {
        headers: {
          "client-id": process.env.CLIENT_ID,
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {

    async function afterValue() {
      let dataReturn = await data.pagination.cursor;
      console.log(dataReturn) 

    }

        /*
        - running through all created UNFULFILLED channel reward redemption and grabbing every user_input field
        - once logic runs through UNFULFILLED rewards, mark rewards as FULFILLED   
        */

        let reward = data.data;
        let vsEmbed = async () => {
          // looping through all of the channel reward's UNFULFILLED redemptions
          for (let i = 0; i < reward.length; i++) {
            console.log(reward[i].user_name);
            let memberData = await message.guild.members.fetch(
              message.author.id
            );

            async function fulfillReward() {
              await fetch(
                `https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=107554430&reward_id=ac1c12ba-51da-4672-ba87-5dca61f2737e&id=${reward[i].id}`,
                {
                  method: "PATCH",
                  headers: {
                    "client-id": process.env.CLIENT_ID,
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    status: "FULFILLED",
                  }),
                }
              );
            }


            // if agrs[1] (twitchName) matches up with one of the unfulfilled reward user_names --> apply role
            if (reward[i].user_name.toLowerCase() === twitchName.toLowerCase()) {
              User.countDocuments(
                { discordID: message.author.id },
                function (err, count) {
                  if (count <= 0) {
                    const initialPromptEmbed = new Discord.MessageEmbed()
                      .setColor("#00C5CD")
                      .setTitle("You haven't verified yourself yet!")
                      .setDescription(
                        "Run the command: `>verify` in this channel."
                      )

                      .setThumbnail("https://i.imgur.com/tpbXWeM.png");
                    message.channel.send(initialPromptEmbed);
                    return;
                  } else {
                    // gets all roles for current user
                    memberData.guild.members.cache.find((role) => {
                      console.log(role);
                    });

                    User.find({}).then(() => {
                      User.findOne(
                        { discordID: message.author.id },
                        function callback(err, res) {
                          console.log(
                            "vs_color initial amount:",
                            res.vs_colors.length
                          );

                          // checking if slight colors is < 11 because if it is maxed out,
                          // the user needs to be prompted with the full color embed instead
                          // if f_colors were to be > 10 the user has completed the color journey and should no longer be prompted
                          if (
                            twitchName.toLowerCase() === res.twitch_username.toLowerCase() &&
                            res.vs_colors.length < 11 &&
                            res.s_colors.length < 11 &&
                            res.f_colors.length < 11
                          ) {
                            message.channel
                              .send(initialPromptEmbed)
                              .then((embed) => {
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
                                    console.error(
                                      "One of the emojis failed to react."
                                    )
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

                                    // function expression that validates and applies a users role
                                    let roleCheck = (roleName) => {
                                      if (
                                        memberData.roles.cache.some(
                                          (role) => role.name === roleName
                                        )
                                      ) {
                                        embed.reply(
                                          "You already have that role!"
                                        );
                                        return false;
                                      } else {
                                        memberData.roles.add(
                                          getRole(roleName, message)
                                        );

                                        // logs the role name and only the role name
                                        console.log(getRole(roleName).name);

                                        User.findOneAndUpdate(
                                          { discordID: message.author.id },
                                          {
                                            $addToSet: {
                                              vs_colors: getRole(roleName).name,
                                            },
                                          },
                                          { upsert: true }
                                        ).then(() => {
                                          User.findOne(
                                            { discordID: message.author.id },
                                            function callback(err, res) {
                                              console.log(
                                                "vs_color amount:",
                                                res.vs_colors.length
                                              );

                                              if (res.vs_colors.length > 10) {
                                                message.channel
                                                  .send(slightColorEmbed)
                                                  .then((s_embed) => {
                                                    s_embed.delete({
                                                      timeout: 60000,
                                                    });
                                                    s_embed
                                                      .react("🇦")
                                                      .then(() =>
                                                        s_embed.react("🇧")
                                                      )
                                                      .then(() =>
                                                        s_embed.react("🇨")
                                                      )
                                                      .then(() =>
                                                        s_embed.react("🇩")
                                                      )
                                                      .then(() =>
                                                        s_embed.react("🇪")
                                                      )
                                                      .then(() =>
                                                        s_embed.react("🇫")
                                                      )
                                                      .then(() =>
                                                        s_embed.react("🇬")
                                                      )
                                                      .then(() =>
                                                        s_embed.react("🇭")
                                                      )
                                                      .then(() =>
                                                        s_embed.react("🇮")
                                                      )
                                                      .then(() =>
                                                        s_embed.react("🇯")
                                                      )
                                                      .then(() =>
                                                        s_embed.react("🇰")
                                                      )
                                                      .catch(() =>
                                                        console.error(
                                                          "One of the emojis failed to react."
                                                        )
                                                      );

                                                    const filter = (
                                                      reaction,
                                                      user
                                                    ) => {
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
                                                        ].includes(
                                                          reaction.emoji.name
                                                        ) &&
                                                        user.id ===
                                                          message.author.id
                                                      );
                                                    };

                                                    s_embed
                                                      .awaitReactions(filter, {
                                                        max: 1,
                                                        time: 60000,
                                                        errors: ["time"],
                                                      })
                                                      .then((collected) => {
                                                        const reaction =
                                                          collected.first();

                                                        // function expression that validates and applies a users role
                                                        let roleCheck = (
                                                          roleName
                                                        ) => {
                                                          if (
                                                            memberData.roles.cache.some(
                                                              (role) =>
                                                                role.name ===
                                                                roleName
                                                            )
                                                          ) {
                                                            s_embed.reply(
                                                              "You already have that role!"
                                                            );

                                                            return false;
                                                          } else {
                                                            memberData.roles.add(
                                                              getRole(
                                                                roleName,
                                                                message
                                                              )
                                                            );

                                                            // grabbing role_name values from json file and looping through
                                                            // all of them using a for in loop
                                                            // (for the use case of removing all vs or s colors at once)
                                                            for (const key in vs_json) {
                                                              if (
                                                                vs_json.hasOwnProperty(
                                                                  key
                                                                )
                                                              ) {
                                                                console.log(
                                                                  key +
                                                                    " -> " +
                                                                    vs_json[key]
                                                                      .role_name
                                                                );
                                                                memberData.roles.remove(
                                                                  getRole(
                                                                    vs_json[key]
                                                                      .role_name
                                                                  )
                                                                );
                                                              }
                                                            }

                                                            // logs the role name and only the role name
                                                            console.log(
                                                              getRole(roleName)
                                                                .name
                                                            );

                                                            User.findOneAndUpdate(
                                                              {
                                                                discordID:
                                                                  message.author
                                                                    .id,
                                                              },
                                                              {
                                                                $addToSet: {
                                                                  s_colors:
                                                                    getRole(
                                                                      roleName
                                                                    ).name,
                                                                },
                                                                $set: {
                                                                  vs_colors: [],
                                                                },
                                                              },
                                                              { upsert: true }
                                                            ).then(() => {
                                                              User.findOne(
                                                                {
                                                                  discordID:
                                                                    message
                                                                      .author
                                                                      .id,
                                                                },
                                                                function callback(
                                                                  err,
                                                                  res
                                                                ) {
                                                                  console.log(
                                                                    "s_color amount:",
                                                                    res.s_colors
                                                                      .length
                                                                  );

                                                                  if (
                                                                    res.s_colors
                                                                      .length >
                                                                    10
                                                                  ) {
                                                                    message.channel
                                                                      .send(
                                                                        fullColorEmbed
                                                                      )
                                                                      .then(
                                                                        (
                                                                          f_embed
                                                                        ) => {
                                                                          f_embed.delete(
                                                                            {
                                                                              timeout: 60000,
                                                                            }
                                                                          );
                                                                          f_embed
                                                                            .react(
                                                                              "🇦"
                                                                            )
                                                                            .then(
                                                                              () =>
                                                                                f_embed.react(
                                                                                  "🇧"
                                                                                )
                                                                            )
                                                                            .then(
                                                                              () =>
                                                                                f_embed.react(
                                                                                  "🇨"
                                                                                )
                                                                            )
                                                                            .then(
                                                                              () =>
                                                                                f_embed.react(
                                                                                  "🇩"
                                                                                )
                                                                            )
                                                                            .then(
                                                                              () =>
                                                                                f_embed.react(
                                                                                  "🇪"
                                                                                )
                                                                            )
                                                                            .then(
                                                                              () =>
                                                                                f_embed.react(
                                                                                  "🇫"
                                                                                )
                                                                            )
                                                                            .then(
                                                                              () =>
                                                                                f_embed.react(
                                                                                  "🇬"
                                                                                )
                                                                            )
                                                                            .then(
                                                                              () =>
                                                                                f_embed.react(
                                                                                  "🇭"
                                                                                )
                                                                            )
                                                                            .then(
                                                                              () =>
                                                                                f_embed.react(
                                                                                  "🇮"
                                                                                )
                                                                            )
                                                                            .then(
                                                                              () =>
                                                                                f_embed.react(
                                                                                  "🇯"
                                                                                )
                                                                            )
                                                                            .then(
                                                                              () =>
                                                                                f_embed.react(
                                                                                  "🇰"
                                                                                )
                                                                            )
                                                                            .catch(
                                                                              () =>
                                                                                console.error(
                                                                                  "One of the emojis failed to react."
                                                                                )
                                                                            );

                                                                          const filter =
                                                                            (
                                                                              reaction,
                                                                              user
                                                                            ) => {
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
                                                                                ].includes(
                                                                                  reaction
                                                                                    .emoji
                                                                                    .name
                                                                                ) &&
                                                                                user.id ===
                                                                                  message
                                                                                    .author
                                                                                    .id
                                                                              );
                                                                            };

                                                                          f_embed
                                                                            .awaitReactions(
                                                                              filter,
                                                                              {
                                                                                max: 1,
                                                                                time: 60000,
                                                                                errors:
                                                                                  [
                                                                                    "time",
                                                                                  ],
                                                                              }
                                                                            )
                                                                            .then(
                                                                              (
                                                                                collected
                                                                              ) => {
                                                                                const reaction =
                                                                                  collected.first();

                                                                                // function expression that validates and applies a users role
                                                                                let roleCheck =
                                                                                  (
                                                                                    roleName
                                                                                  ) => {
                                                                                    if (
                                                                                      memberData.roles.cache.some(
                                                                                        (
                                                                                          role
                                                                                        ) =>
                                                                                          role.name ===
                                                                                          roleName
                                                                                      )
                                                                                    ) {
                                                                                      f_embed.reply(
                                                                                        "You already have that role!"
                                                                                      );

                                                                                      return false;
                                                                                    } else {
                                                                                      memberData.roles.add(
                                                                                        getRole(
                                                                                          roleName,
                                                                                          message
                                                                                        )
                                                                                      );

                                                                                      // grabbing role_name values from json file and looping through all of them using a for in loop
                                                                                      for (const key in vs_json) {
                                                                                        if (
                                                                                          vs_json.hasOwnProperty(
                                                                                            key
                                                                                          )
                                                                                        ) {
                                                                                          console.log(
                                                                                            key +
                                                                                              " -> " +
                                                                                              s_json[
                                                                                                key
                                                                                              ]
                                                                                                .role_name
                                                                                          );
                                                                                          memberData.roles.remove(
                                                                                            getRole(
                                                                                              s_json[
                                                                                                key
                                                                                              ]
                                                                                                .role_name
                                                                                            )
                                                                                          );
                                                                                        }
                                                                                      }

                                                                                      // logs the role name and only the role name
                                                                                      console.log(
                                                                                        getRole(
                                                                                          roleName
                                                                                        )
                                                                                          .name
                                                                                      );

                                                                                      User.findOneAndUpdate(
                                                                                        {
                                                                                          discordID:
                                                                                            message
                                                                                              .author
                                                                                              .id,
                                                                                        },
                                                                                        {
                                                                                          $addToSet:
                                                                                            {
                                                                                              f_colors:
                                                                                                getRole(
                                                                                                  roleName
                                                                                                )
                                                                                                  .name,
                                                                                            },
                                                                                          $set: {
                                                                                            s_colors:
                                                                                              [],
                                                                                          },
                                                                                        },
                                                                                        {
                                                                                          upsert: true,
                                                                                        }
                                                                                      ).then(
                                                                                        () => {
                                                                                          User.findOne(
                                                                                            {
                                                                                              discordID:
                                                                                                message
                                                                                                  .author
                                                                                                  .id,
                                                                                            },
                                                                                            function callback(
                                                                                              err,
                                                                                              res
                                                                                            ) {
                                                                                              console.log(
                                                                                                "s_color amount:",
                                                                                                res
                                                                                                  .s_colors
                                                                                                  .length
                                                                                              );

                                                                                              if (
                                                                                                err
                                                                                              ) {
                                                                                                console.log(
                                                                                                  err
                                                                                                );
                                                                                              }
                                                                                            }
                                                                                          );
                                                                                        }
                                                                                      );

                                                                                      // after the color role is applied to user in discord,
                                                                                      // set user's channel point reward is set to FULFILLED
                                                                                      fulfillReward();

                                                                                      f_embed.reply(
                                                                                        "Role successfully applied!"
                                                                                      );
                                                                                    }
                                                                                  };

                                                                                switch (
                                                                                  reaction
                                                                                    .emoji
                                                                                    .name
                                                                                ) {
                                                                                  case "🇦":
                                                                                    // checking if user already has the role. if not then apply
                                                                                    roleCheck(
                                                                                      "red"
                                                                                    );
                                                                                    break;
                                                                                  case "🇧":
                                                                                    roleCheck(
                                                                                      "orange"
                                                                                    );
                                                                                    break;
                                                                                  case "🇨":
                                                                                    roleCheck(
                                                                                      "yellow"
                                                                                    );
                                                                                    break;
                                                                                  case "🇩":
                                                                                    roleCheck(
                                                                                      "green"
                                                                                    );
                                                                                    break;
                                                                                  case "🇪":
                                                                                    roleCheck(
                                                                                      "blue"
                                                                                    );
                                                                                    break;
                                                                                  case "🇫":
                                                                                    roleCheck(
                                                                                      "cyan"
                                                                                    );
                                                                                    break;
                                                                                  case "🇬":
                                                                                    roleCheck(
                                                                                      "purple"
                                                                                    );
                                                                                    break;
                                                                                  case "🇭":
                                                                                    roleCheck(
                                                                                      "brown"
                                                                                    );
                                                                                    break;
                                                                                  case "🇮":
                                                                                    roleCheck(
                                                                                      "indigo"
                                                                                    );
                                                                                    break;
                                                                                  case "🇯":
                                                                                    roleCheck(
                                                                                      "violet"
                                                                                    );
                                                                                    break;
                                                                                  case "🇰":
                                                                                    roleCheck(
                                                                                      "pink"
                                                                                    );
                                                                                    break;
                                                                                  default:
                                                                                    f_embed.reply(
                                                                                      "Oops. Something went wrong!"
                                                                                    );
                                                                                }
                                                                              }
                                                                            )
                                                                            .catch(
                                                                              (
                                                                                err
                                                                              ) => {
                                                                                console.log(
                                                                                  err
                                                                                );
                                                                                f_embed.reply(
                                                                                  "You didn't leave a reaction in time!"
                                                                                );
                                                                              }
                                                                            );
                                                                        }
                                                                      );
                                                                  }

                                                                  if (err) {
                                                                    console.log(
                                                                      err
                                                                    );
                                                                  }
                                                                }
                                                              );
                                                            });

                                                            // after the color role is applied to user in discord,
                                                            // set user's channel point reward is set to FULFILLED
                                                            fulfillReward();

                                                            s_embed.reply(
                                                              "Role successfully applied!"
                                                            );
                                                          }
                                                        };

                                                        switch (
                                                          reaction.emoji.name
                                                        ) {
                                                          case "🇦":
                                                            // checking if user already has the role. if not then apply
                                                            roleCheck(
                                                              "slightly red"
                                                            );
                                                            break;
                                                          case "🇧":
                                                            roleCheck(
                                                              "slightly orange"
                                                            );
                                                            break;
                                                          case "🇨":
                                                            roleCheck(
                                                              "slightly yellow"
                                                            );
                                                            break;
                                                          case "🇩":
                                                            roleCheck(
                                                              "slightly green"
                                                            );
                                                            break;
                                                          case "🇪":
                                                            roleCheck(
                                                              "slightly blue"
                                                            );
                                                            break;
                                                          case "🇫":
                                                            roleCheck(
                                                              "slightly cyan"
                                                            );
                                                            break;
                                                          case "🇬":
                                                            roleCheck(
                                                              "slightly purple"
                                                            );
                                                            break;
                                                          case "🇭":
                                                            roleCheck(
                                                              "slightly brown"
                                                            );
                                                            break;
                                                          case "🇮":
                                                            roleCheck(
                                                              "slightly indigo"
                                                            );
                                                            break;
                                                          case "🇯":
                                                            roleCheck(
                                                              "slightly violet"
                                                            );
                                                            break;
                                                          case "🇰":
                                                            roleCheck(
                                                              "slightly pink"
                                                            );
                                                            break;
                                                          default:
                                                            s_embed.reply(
                                                              "Oops. Something went wrong!"
                                                            );
                                                        }
                                                      })
                                                      .catch((err) => {
                                                        console.log(err);
                                                        s_embed.reply(
                                                          "You didn't leave a reaction in time!"
                                                        );
                                                      });
                                                  });
                                              }
                                              if (err) {
                                                console.log(err);
                                              }
                                            }
                                          );
                                        });
                                        /*  - checking if the user reaches the max amount of vs_colors after applying the role through the embed
                                  - if the user has 11 when applying their role, run another embed prompting the user that they have an option to trade in all of their 
                                     very slight colors for one slight color.
                                  - let user know that they can run the command again anytime they please if they want a slight color in the future
                                */

                                        // after the color role is applied to user in discord,
                                        // set user's channel point reward is set to FULFILLED
                                        fulfillReward();

                                        embed.reply(
                                          "Role successfully applied!"
                                        );
                                      }
                                    };

                                    switch (reaction.emoji.name) {
                                      case "🇦":
                                        // checking if user already has the role. if not then apply
                                        roleCheck("very slightly red");
                                        break;
                                      case "🇧":
                                        roleCheck("very slightly orange");
                                        break;
                                      case "🇨":
                                        roleCheck("very slightly yellow");
                                        break;
                                      case "🇩":
                                        roleCheck("very slightly green");
                                        break;
                                      case "🇪":
                                        roleCheck("very slightly blue");
                                        break;
                                      case "🇫":
                                        roleCheck("very slightly cyan");
                                        break;
                                      case "🇬":
                                        roleCheck("very slightly purple");
                                        break;
                                      case "🇭":
                                        roleCheck("very slightly brown");
                                        break;
                                      case "🇮":
                                        roleCheck("very slightly indigo");
                                        break;
                                      case "🇯":
                                        roleCheck("very slightly violet");
                                        break;
                                      case "🇰":
                                        roleCheck("very slightly pink");
                                        break;
                                      default:
                                        embed.reply(
                                          "Oops. Something went wrong!"
                                        );
                                    }
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                    embed.reply(
                                      "You didn't leave a reaction in time!"
                                    );
                                  });
                              });
                          } else if (twitchName.toLowerCase() !== res.twitch_username.toLowerCase()) {
                            message.channel.send('This twitch username is not authorized under your account.\n(Yes I know this error message sent three times, I will fix it soon... maybe.')
                          }

                          // if very slight color length is > 10
                          User.findOne(
                            { discordID: message.author.id },
                            function callback(err, res) {
                              console.log(
                                "vs_color initial amount:",
                                res.vs_colors.length
                              );

                              if (twitchName.toLowerCase() === res.twitch_username.toLowerCase() && res.vs_colors.length > 10) {
                                message.channel
                                  .send(slightColorEmbed)
                                  .then((s_embed) => {
                                    s_embed.delete({ timeout: 60000 });
                                    s_embed
                                      .react("🇦")
                                      .then(() => s_embed.react("🇧"))
                                      .then(() => s_embed.react("🇨"))
                                      .then(() => s_embed.react("🇩"))
                                      .then(() => s_embed.react("🇪"))
                                      .then(() => s_embed.react("🇫"))
                                      .then(() => s_embed.react("🇬"))
                                      .then(() => s_embed.react("🇭"))
                                      .then(() => s_embed.react("🇮"))
                                      .then(() => s_embed.react("🇯"))
                                      .then(() => s_embed.react("🇰"))
                                      .catch(() =>
                                        console.error(
                                          "One of the emojis failed to react."
                                        )
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

                                    s_embed
                                      .awaitReactions(filter, {
                                        max: 1,
                                        time: 60000,
                                        errors: ["time"],
                                      })
                                      .then((collected) => {
                                        const reaction = collected.first();

                                        // function expression that validates and applies a users role
                                        let roleCheck = (roleName) => {
                                          if (
                                            memberData.roles.cache.some(
                                              (role) => role.name === roleName
                                            )
                                          ) {
                                            s_embed.reply(
                                              "You already have that role!"
                                            );

                                            return false;
                                          } else {
                                            memberData.roles.add(
                                              getRole(roleName, message)
                                            );

                                            // grabbing role_name values from json file and looping through all of them using a for in loop
                                            for (const key in vs_json) {
                                              if (vs_json.hasOwnProperty(key)) {
                                                console.log(
                                                  key +
                                                    " -> " +
                                                    vs_json[key].role_name
                                                );
                                                memberData.roles.remove(
                                                  getRole(
                                                    vs_json[key].role_name
                                                  )
                                                );
                                              }
                                            }

                                            // logs the role name and only the role name
                                            console.log(getRole(roleName).name);

                                            User.findOneAndUpdate(
                                              {
                                                discordID: message.author.id,
                                              },
                                              {
                                                $addToSet: {
                                                  s_colors:
                                                    getRole(roleName).name,
                                                },
                                                $set: {
                                                  vs_colors: [],
                                                },
                                              },
                                              { upsert: true }
                                            ).then(() => {
                                              User.findOne(
                                                {
                                                  discordID: message.author.id,
                                                },
                                                function callback(err, res) {
                                                  console.log(
                                                    "s_color amount:",
                                                    res.s_colors.length
                                                  );

                                                  if (
                                                    res.s_colors.length > 10
                                                  ) {
                                                    message.channel
                                                      .send(fullColorEmbed)
                                                      .then((f_embed) => {
                                                        f_embed.delete({
                                                          timeout: 60000,
                                                        });
                                                        f_embed
                                                          .react("🇦")
                                                          .then(() =>
                                                            f_embed.react("🇧")
                                                          )
                                                          .then(() =>
                                                            f_embed.react("🇨")
                                                          )
                                                          .then(() =>
                                                            f_embed.react("🇩")
                                                          )
                                                          .then(() =>
                                                            f_embed.react("🇪")
                                                          )
                                                          .then(() =>
                                                            f_embed.react("🇫")
                                                          )
                                                          .then(() =>
                                                            f_embed.react("🇬")
                                                          )
                                                          .then(() =>
                                                            f_embed.react("🇭")
                                                          )
                                                          .then(() =>
                                                            f_embed.react("🇮")
                                                          )
                                                          .then(() =>
                                                            f_embed.react("🇯")
                                                          )
                                                          .then(() =>
                                                            f_embed.react("🇰")
                                                          )
                                                          .catch(() =>
                                                            console.error(
                                                              "One of the emojis failed to react."
                                                            )
                                                          );

                                                        const filter = (
                                                          reaction,
                                                          user
                                                        ) => {
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
                                                            ].includes(
                                                              reaction.emoji
                                                                .name
                                                            ) &&
                                                            user.id ===
                                                              message.author.id
                                                          );
                                                        };

                                                        f_embed
                                                          .awaitReactions(
                                                            filter,
                                                            {
                                                              max: 1,
                                                              time: 60000,
                                                              errors: ["time"],
                                                            }
                                                          )
                                                          .then((collected) => {
                                                            const reaction =
                                                              collected.first();

                                                            // function expression that validates and applies a users role
                                                            let roleCheck = (
                                                              roleName
                                                            ) => {
                                                              if (
                                                                memberData.roles.cache.some(
                                                                  (role) =>
                                                                    role.name ===
                                                                    roleName
                                                                )
                                                              ) {
                                                                f_embed.reply(
                                                                  "You already have that role!"
                                                                );

                                                                return false;
                                                              } else {
                                                                memberData.roles.add(
                                                                  getRole(
                                                                    roleName,
                                                                    message
                                                                  )
                                                                );

                                                                // grabbing role_name values from json file and looping through all of them using a for in loop
                                                                for (const key in vs_json) {
                                                                  if (
                                                                    vs_json.hasOwnProperty(
                                                                      key
                                                                    )
                                                                  ) {
                                                                    console.log(
                                                                      key +
                                                                        " -> " +
                                                                        s_json[
                                                                          key
                                                                        ]
                                                                          .role_name
                                                                    );
                                                                    memberData.roles.remove(
                                                                      getRole(
                                                                        s_json[
                                                                          key
                                                                        ]
                                                                          .role_name
                                                                      )
                                                                    );
                                                                  }
                                                                }

                                                                // logs the role name and only the role name
                                                                console.log(
                                                                  getRole(
                                                                    roleName
                                                                  ).name
                                                                );

                                                                User.findOneAndUpdate(
                                                                  {
                                                                    discordID:
                                                                      message
                                                                        .author
                                                                        .id,
                                                                  },
                                                                  {
                                                                    $addToSet: {
                                                                      f_colors:
                                                                        getRole(
                                                                          roleName
                                                                        ).name,
                                                                    },
                                                                    $set: {
                                                                      s_colors:
                                                                        [],
                                                                    },
                                                                  },
                                                                  {
                                                                    upsert: true,
                                                                  }
                                                                ).then(() => {
                                                                  User.findOne(
                                                                    {
                                                                      discordID:
                                                                        message
                                                                          .author
                                                                          .id,
                                                                    },
                                                                    function callback(
                                                                      err,
                                                                      res
                                                                    ) {
                                                                      console.log(
                                                                        "f_color amount:",
                                                                        res
                                                                          .f_colors
                                                                          .length
                                                                      );

                                                                      if (
                                                                        res
                                                                          .f_colors
                                                                          .length >
                                                                        10
                                                                      ) {
                                                                        message.channel.send(
                                                                          congratsEmbed
                                                                        );
                                                                      }

                                                                      if (err) {
                                                                        console.log(
                                                                          err
                                                                        );
                                                                      }
                                                                    }
                                                                  );
                                                                });

                                                                // after the color role is applied to user in discord,
                                                                // set user's channel point reward is set to FULFILLED
                                                                fulfillReward();

                                                                f_embed.reply(
                                                                  "Role successfully applied!"
                                                                );
                                                              }
                                                            };

                                                            switch (
                                                              reaction.emoji
                                                                .name
                                                            ) {
                                                              case "🇦":
                                                                // checking if user already has the role. if not then apply
                                                                roleCheck(
                                                                  "red"
                                                                );
                                                                break;
                                                              case "🇧":
                                                                roleCheck(
                                                                  "orange"
                                                                );
                                                                break;
                                                              case "🇨":
                                                                roleCheck(
                                                                  "yellow"
                                                                );
                                                                break;
                                                              case "🇩":
                                                                roleCheck(
                                                                  "green"
                                                                );
                                                                break;
                                                              case "🇪":
                                                                roleCheck(
                                                                  "blue"
                                                                );
                                                                break;
                                                              case "🇫":
                                                                roleCheck(
                                                                  "cyan"
                                                                );
                                                                break;
                                                              case "🇬":
                                                                roleCheck(
                                                                  "purple"
                                                                );
                                                                break;
                                                              case "🇭":
                                                                roleCheck(
                                                                  "brown"
                                                                );
                                                                break;
                                                              case "🇮":
                                                                roleCheck(
                                                                  "indigo"
                                                                );
                                                                break;
                                                              case "🇯":
                                                                roleCheck(
                                                                  "violet"
                                                                );
                                                                break;
                                                              case "🇰":
                                                                roleCheck(
                                                                  "pink"
                                                                );
                                                                break;
                                                              default:
                                                                f_embed.reply(
                                                                  "Oops. Something went wrong!"
                                                                );
                                                            }
                                                          })
                                                          .catch((err) => {
                                                            console.log(err);
                                                            f_embed.reply(
                                                              "You didn't leave a reaction in time!"
                                                            );
                                                          });
                                                      });
                                                  }

                                                  if (err) {
                                                    console.log(err);
                                                  }
                                                }
                                              );
                                            });

                                            // after the color role is applied to user in discord,
                                            // set user's channel point reward is set to FULFILLED
                                            fulfillReward();

                                            s_embed.reply(
                                              "Role successfully applied!"
                                            );
                                          }
                                        };

                                        switch (reaction.emoji.name) {
                                          case "🇦":
                                            // checking if user already has the role. if not then apply
                                            roleCheck("slightly red");
                                            break;
                                          case "🇧":
                                            roleCheck("slightly orange");
                                            break;
                                          case "🇨":
                                            roleCheck("slightly yellow");
                                            break;
                                          case "🇩":
                                            roleCheck("slightly green");
                                            break;
                                          case "🇪":
                                            roleCheck("slightly blue");
                                            break;
                                          case "🇫":
                                            roleCheck("slightly cyan");
                                            break;
                                          case "🇬":
                                            roleCheck("slightly purple");
                                            break;
                                          case "🇭":
                                            roleCheck("slightly brown");
                                            break;
                                          case "🇮":
                                            roleCheck("slightly indigo");
                                            break;
                                          case "🇯":
                                            roleCheck("slightly violet");
                                            break;
                                          case "🇰":
                                            roleCheck("slightly pink");
                                            break;
                                          default:
                                            s_embed.reply(
                                              "Oops. Something went wrong!"
                                            );
                                        }
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                        s_embed.reply(
                                          "You didn't leave a reaction in time!"
                                        );
                                      });
                                  });
                              } else if (twitchName.toLowerCase() !== res.twitch_username.toLowerCase()) {
                                message.channel.send('This twitch username is not authorized under your account.\n(Yes I know this error message sent three times, I will fix it soon... maybe.')
                              }
                            }
                          );

                          //  if slight color length is > 10 (maxed out)
                          User.findOne(
                            {
                              discordID: message.author.id,
                            },
                            function callback(err, res) {
                              console.log(
                                "s_color initial amount check:",
                                res.s_colors.length
                              );

                              if (twitchName.toLowerCase() === res.twitch_username.toLowerCase() && res.s_colors.length > 10) {
                                message.channel
                                  .send(fullColorEmbed)
                                  .then((f_embed) => {
                                    f_embed.delete({
                                      timeout: 60000,
                                    });
                                    f_embed
                                      .react("🇦")
                                      .then(() => f_embed.react("🇧"))
                                      .then(() => f_embed.react("🇨"))
                                      .then(() => f_embed.react("🇩"))
                                      .then(() => f_embed.react("🇪"))
                                      .then(() => f_embed.react("🇫"))
                                      .then(() => f_embed.react("🇬"))
                                      .then(() => f_embed.react("🇭"))
                                      .then(() => f_embed.react("🇮"))
                                      .then(() => f_embed.react("🇯"))
                                      .then(() => f_embed.react("🇰"))
                                      .catch(() =>
                                        console.error(
                                          "One of the emojis failed to react."
                                        )
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

                                    f_embed
                                      .awaitReactions(filter, {
                                        max: 1,
                                        time: 60000,
                                        errors: ["time"],
                                      })
                                      .then((collected) => {
                                        const reaction = collected.first();

                                        // function expression that validates and applies a users role
                                        let roleCheck = (roleName) => {
                                          if (
                                            memberData.roles.cache.some(
                                              (role) => role.name === roleName
                                            )
                                          ) {
                                            f_embed.reply(
                                              "You already have that role!"
                                            );

                                            return false;
                                          } else {
                                            memberData.roles.add(
                                              getRole(roleName, message)
                                            );

                                            // grabbing role_name values from json file and looping through all of them using a for in loop
                                            for (const key in vs_json) {
                                              if (vs_json.hasOwnProperty(key)) {
                                                console.log(
                                                  key +
                                                    " -> " +
                                                    s_json[key].role_name
                                                );
                                                memberData.roles.remove(
                                                  getRole(s_json[key].role_name)
                                                );
                                              }
                                            }

                                            // logs the role name and only the role name
                                            console.log(getRole(roleName).name);

                                            User.findOneAndUpdate(
                                              {
                                                discordID: message.author.id,
                                              },
                                              {
                                                $addToSet: {
                                                  f_colors:
                                                    getRole(roleName).name,
                                                },
                                                $set: {
                                                  s_colors: [],
                                                },
                                              },
                                              {
                                                upsert: true,
                                              }
                                            ).then(() => {
                                              User.findOne(
                                                {
                                                  discordID: message.author.id,
                                                },
                                                function callback(err, res) {
                                                  console.log(
                                                    "f_color amount:",
                                                    res.f_colors.length
                                                  );

                                                  if (
                                                    res.f_colors.length > 10
                                                  ) {
                                                    message.channel.send(
                                                      congratsEmbed
                                                    );
                                                  }

                                                  if (err) {
                                                    console.log(err);
                                                  }
                                                }
                                              );
                                            });

                                            // after the color role is applied to user in discord,
                                            // set user's channel point reward is set to FULFILLED
                                            fulfillReward();

                                            f_embed.reply(
                                              "Role successfully applied!"
                                            );
                                          }
                                        };

                                        switch (reaction.emoji.name) {
                                          case "🇦":
                                            // checking if user already has the role. if not then apply
                                            roleCheck("red");
                                            break;
                                          case "🇧":
                                            roleCheck("orange");
                                            break;
                                          case "🇨":
                                            roleCheck("yellow");
                                            break;
                                          case "🇩":
                                            roleCheck("green");
                                            break;
                                          case "🇪":
                                            roleCheck("blue");
                                            break;
                                          case "🇫":
                                            roleCheck("cyan");
                                            break;
                                          case "🇬":
                                            roleCheck("purple");
                                            break;
                                          case "🇭":
                                            roleCheck("brown");
                                            break;
                                          case "🇮":
                                            roleCheck("indigo");
                                            break;
                                          case "🇯":
                                            roleCheck("violet");
                                            break;
                                          case "🇰":
                                            roleCheck("pink");
                                            break;
                                          default:
                                            f_embed.reply(
                                              "Oops. Something went wrong!"
                                            );
                                        }
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                        f_embed.reply(
                                          "You didn't leave a reaction in time!"
                                        );
                                      });
                                  });
                              } else if (twitchName.toLowerCase() !== res.twitch_username.toLowerCase()) {
                                message.channel.send('This twitch username is not authorized under your account.\n(Yes I know this error message sent three times, I will fix it soon... maybe.')
                              }

                              if (err) {
                                console.log(err);
                              }
                            }
                          );

                          // if all full colors have been achieved:
                          User.findOne(
                            {
                              discordID: message.author.id,
                            },
                            function callback(err, res) {
                              console.log(
                                "f_color initial amount check:",
                                res.s_colors.length
                              );

                              if (res.f_colors.length > 10) {
                                message.channel.send(congratsEmbed);
                              }
                            }
                          );
                        }
                      );
                    });
                  }
                }
              );

              // return true if the provided twitchName is valid
              return true;
            }
          }
          // else return test();
          return inValid();
        };

        return vsEmbed();
      });
  },
};
