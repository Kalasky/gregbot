require("dotenv").config();
const User = require("../models/user");
const Discord = require("discord.js");
const vs_json = require("../vs_colors.json");
const s_json = require("../s_colors.json");

module.exports = {
  name: "scan",
  syntax: ">scan",
  description:
    "Scans through every verified user in the discord server, and updates their current roles in the database.",
  include: true,
  args: false,
  execute(message, args) {
    User.find({}, function (err, docs) {
      docs.map((user) => {
        // fetching all users in discord that are in db
        message.guild.members.fetch(user.discordID).then((userData) => {
          // returning all verified user data from discord
          // console.log(userData);

          for (const key in vs_json) {
            async function roleScan() {
                const value = await userData.roles.cache.find((role) => role.name === vs_json[key].role_name);
                if (value) {
                    // console.log(userData.user.id, value.name); // logging corresponding id's & role names 
                    try {  const userQuery = await User.updateMany({
                        _id: { $eq: user._id },},{
                        $addToSet: {
                          vs_colors: {
                            $each: [value.name]
                          }
                        }
                    });     
                    return userQuery;
                  } catch(e) {console.error(e);}
                }
             }
             roleScan();
          }
        });
      });
    });
  },
};
