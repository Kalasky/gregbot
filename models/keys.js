const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

const keySchema = new mongoose.Schema(
  {
    accessToken: {
      type: String,
      trim: true,
      required: false,
    },
    clientID: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

keySchema.pre("save", function (next) {
  const user = this;

  if (
    this.isModified("clientID") ||
    this.isModified("accessToken") ||
    this.isNew
  ) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.clientID, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.clientID = hash;
        });
        bcrypt.hash(user.accessToken, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.accessToken = hash;
          next();
        });
      }
    });
  } else {
    // next() method tells Mongoose to end the middleware and move on to the next step in the process.
    return next();
  }
});

module.exports = mongoose.model("Key", keySchema);
