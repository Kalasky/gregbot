require("dotenv").config();
const tmi = require("tmi.js");
const API = require("call-of-duty-api")();

const options = {
  options: { debug: true },
  connection: {
    cluster: "aws",
    reconnect: true,
  },
  identity: {
    username: "GregBot",
    password: process.env.AUTH_TOKEN,
  },
  channels: ["kalaskyyy"],
};

const client = new tmi.client(options);

client.connect();

client.on("connected", (address, port) => {
  client.action("kalaskyyy", "connected");
});

client.on("chat", (channel, user, message, self) => {
  API.login(process.env.COD_EMAIL, process.env.COD_PASSWORD).then(() => {
    const id = "Kalasky#1415";
    const platform = "battle";
    API.MWBattleData(id, platform)
      .then((wzData) => {
        let kd = wzData.br.kdRatio.toFixed(6).slice(0, -4);
        let kills = wzData.br.kills;
        let wins = wzData.br.wins;
        let topTen = wzData.br.topTen;
        let topFive = wzData.br.topFive;

        // if (message === ">wins") {
        //   client.action("kalaskyyy", `Kalasky has ${expr} wins in Warzone`);
        // }

        switch (message) {
          case ">kills":
            client.action("kalaskyyy", `Kalasky has ${kills} kills in Warzone`);
            break;
          case ">wins":
            client.action("kalaskyyy", `Kalasky has ${wins} wins in Warzone`);
            break;
          case ">top10":
            client.action(
              "kalaskyyy",
              `Kalasky has finished top ten in ${topTen} games of Warzone`
            );
            break;
          case ">top5":
            client.action(
              "kalaskyyy",
              `Kalasky has finished top five in ${topFive} games of Warzone`
            );
            break;

          default:
            console.log("invalid command");
        }
      })
      .catch((err) => {
        const trackUserError = new Discord.MessageEmbed()
          .setColor("#FF0000")
          .setTitle("Error")
          .setDescription(
            '- Syntax: `!trackuser <username> <platform>` \n- Run `!platforms` to view a list of trackable platforms.\n- If the username contains spaces wrap it in quotes.\n- Example for a name with spaces: `!trackuser "TT Cudi" xbl`\n- Make sure the username and platform are corresponding. \n- You may also have provided an incorrect username or platform. '
          )
          .setThumbnail("https://i.imgur.com/I6hxLXI.png");

        message.channel.send(trackUserError);
      });
  });
});
