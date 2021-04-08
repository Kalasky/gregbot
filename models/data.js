const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    rank: {
      type: String,
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
    blocked_colors: {
      type: Array,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Data", playerSchema);
