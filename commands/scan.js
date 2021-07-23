require("dotenv").config();
const User = require("../models/user");
const Discord = require("discord.js");
const vs_colors = require("../vs_colors.json");
const s_colors = require("../s_colors.json");
const f_colors = require("../f_colors.json");


module.exports = {
  name: "scan",
  syntax: ">scan",
  description:
    "Scans through every verified user in the discord server, and updates their current roles in the database.",
  include: true,
  args: false,
  execute(message, args) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.send("You must be an admin to execute this command.");
      return false;
    }

    User.find({}, function (err, docs) {
      docs.map((user) => {
        // fetching all users in discord that are in db
        message.guild.members.fetch(user.discordID).then((userData) => {
          // returning all verified user data from discord
          // console.log(userData);

          // very slight colors
          for (const key in vs_colors) {
            async function vsRoleScan() {
                const value = await userData.roles.cache.find((role) => role.name === vs_colors[key].role_name);
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
             vsRoleScan();
          }
          // slight colors
          for (const key in s_colors) {
            async function sRoleScan() {
                const value = await userData.roles.cache.find((role) => role.name === s_colors[key].role_name);
                if (value) {
                    // console.log(userData.user.id, value.name); // logging corresponding id's & role names 
                    try {  const userQuery = await User.updateMany({
                        _id: { $eq: user._id },},{
                        $addToSet: {
                          s_colors: {
                            $each: [value.name]
                          }
                        }
                    });     
                    return userQuery;
                  } catch(e) {console.error(e);}
                }
             }
             sRoleScan();
          }
          // full colors
          for (const key in f_colors) {
            async function fRoleScan() {
                const value = await userData.roles.cache.find((role) => role.name === f_colors[key].role_name);
                if (value) {
                    // console.log(userData.user.id, value.name); // logging corresponding id's & role names 
                    try {  const userQuery = await User.updateMany({
                        _id: { $eq: user._id },},{
                        $addToSet: {
                          f_colors: {
                            $each: [value.name]
                          }
                        }
                    });     
                    return userQuery;
                  } catch(e) {console.error(e);}
                }
             }
             fRoleScan();
          }
        });
      });
    });
  },
};
