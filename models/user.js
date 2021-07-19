const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    discordID: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    vs_colors: {
      type: Array,
      trim: true,
      required: true,
    },
    s_colors: {
      type: Array,
      trim: true,
      required: true,
    },
    f_colors: {
      type: Array,
      trim: true,
      required: true,
    },
    twitch_username: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
