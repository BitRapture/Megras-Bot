// DiscordJS API initialization
const { Client, Intents } = require("discord.js");
var Bot = {};
Bot.client = new Client({ intents: new Intents(0b1111111111111111) });

// Command manager initialization
Bot.commands = {};

// API keys initialization
Bot.keys = require("./src/secret/keys.json");

// Setup ready listener
Bot.client.on("ready", () => {
    console.log(`Logged into Discord as ${Bot.client.user.tag}`);
});

// Setup message listener
Bot.client.on("messageCreate", (message) => {

});

// Log into discord
Bot.client.login(Bot.keys.token);