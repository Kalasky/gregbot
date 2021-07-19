const passport = require("passport");
const DiscordStrategy = require("passport-discord");
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.discordID);
});

passport.deserializeUser(async (discordID, done) => {
  try {
    const user = await User.findOne({ discordID });
    return user ? done(null, user) : done(null, null);
  } catch (err) {
    console.log(err);
    done(err, null);
  }
});

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.CLIENT_REDIRECT,
      scope: ["identify", "connections"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, connections } = profile;
      console.log(id, connections);

      function search(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
          if (myArray[i].type === nameKey) {
            return myArray[i];
          }
        }
      }

      var resultObject = search("twitch", connections);
      // returning twitch username
      console.log(resultObject.name);

      try {
        const findUser = await User.findOneAndUpdate(
          { discordID: id },
          {
            $set: { twitch_username: resultObject.name },
          },
          { upsert: true }
        );
        if (findUser) {
          console.log("User was found");
          return done(null, findUser);
        } else {
          const newUser = await User.findOneAndUpdate(
            { discordID: id },
            {
              $set: {
                vs_colors: [],
                s_colors: [],
                f_colors: [],
                twitch_username: resultObject.name,
              },
            },
            { upsert: true }
          );
          return done(null, newUser);
        }
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);
