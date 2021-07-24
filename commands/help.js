require("dotenv").config();
const Discord = require("discord.js");

module.exports = {
  name: "help",
  syntax: ">help",
  description: "Displays helpful list of command usage.",
  include: true,
  args: false,
  execute(message, args) {
    const initialPromptEmbed = new Discord.MessageEmbed()
      .setColor("#00C5CD")
      .setTitle("Help Menu")
      .addFields(
        {
          name: ">verify",
          value:
            "- This confirms that it's actually your Twitch account, and prevents identity fraud.\n- `Make sure you have your Twitch connected to your discord account!`\n- `You do not need to display the connection on your profile.`\nIf you changed your name or want to use a different account, reconnect the new Twitch account to your Discord account and re-verify yourself.",
        },
        {
          name: ">color twitch_username",
          value:
            "- Once you have verified your account with the >verify command, run this command to get your colors!\n- For example, if your twitch username is GregTheBoomer then you'd run `>color gregtheboomer`.\n- Your username is not case-sensitive.",
        },
        {
          name: ">scan",
          value:
            "- Only server admins can run this command.\n- Scans all verified users untracked color roles and logs them in the database.",
        },
        {
          name: ">setup-roles",
          value:
            "- Only server admins can run this command. Creates all required color roles in the Discord server.",
        }
      )
      .setThumbnail("https://i.imgur.com/tpbXWeM.png");

    message.author.send(initialPromptEmbed);
  },
};
