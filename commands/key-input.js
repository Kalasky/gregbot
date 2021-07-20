require("dotenv").config();
const Discord = require("discord.js");

module.exports = {
  name: "verify",
  syntax: ">verify",
  description: "Verifies your twitch account..",
  include: true,
  args: false,
  execute(message, args) {
    const dmWarning = new Discord.MessageEmbed()
      .setColor("#FF0000")
      .setTitle("This command must be executed in a server.")

      .setThumbnail("https://i.imgur.com/I6hxLXI.png");

    if (message.channel.type === "dm") {
      message.author.send(dmWarning);
      return;
    }

    const initialPromptEmbed = new Discord.MessageEmbed()
      .setColor("#00C5CD")
      .setTitle("Click the link below to get verified!")
      .setDescription(
        "https://gregthebot.herokuapp.com/api/auth/discord/redirect"
      )
      .addFields(
        {
          name: "Why do I need to verify my Discord account?",
          value:
            "This confirms your Twitch username, and prevents identity fraud. Having someone use your Twitch username to steal a color isn't fun :(",
        },
        {
          name: "Tip:",
          value:
            "If you successfully authorized your account, run `>color {twitch username}` in the server to get your color if you redeemed one.",
        }
      )
      .setThumbnail("https://i.imgur.com/tpbXWeM.png");

    message.author.send(initialPromptEmbed);
  },
};
