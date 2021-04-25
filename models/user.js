const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    vs_colors_amount: {
      type: Number,
      trim: true,
      required: true,
    },
    s_colors_amount: {
      type: Number,
      trim: true,
      required: true,
    },
    f_colors_amount: {
      type: Number,
      trim: true,
      required: true,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
