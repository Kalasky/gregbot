const router = require("express").Router();
const passport = require("passport");

router.get("/discord", passport.authenticate("discord"));

router.get(
  "/discord/redirect",
  passport.authenticate("discord"),
  (req, res) => {
    res.sendStatus(200);
    res.sendFile(path.join(__dirname, "../public/index.html"));
  }
);

module.exports = router;
