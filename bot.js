// DiscordJS API initialization
const { Client, Intents } = require("discord.js");
var Bot = { client : new Client({ intents: new Intents(0b1111111111111111) }) };

// SQL storage initialization
const Enmap = require("enmap");
Bot.store = {
    dev : new Enmap({name: "dev", fetchAll: false, dataDir: "./store"}),
    users : {
        inv : new Enmap({name: "userInv", fetchAll: false, dataDir: "./store"}),
        lvl : new Enmap({name: "userLvl", fetchAll: false, dataDir: "./store"})
    }
};

// Command manager initialization
const FS = require("fs");
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