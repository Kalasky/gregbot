require("dotenv").config();
const tmi = require("tmi.js");

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
  if (message === "!game") {
    client.action("kalaskyyy", "yo");
  }
});
