// DiscordJS API initialization
const { Client, Intents } = require("discord.js");
var Bot = {};
Bot.client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILDS_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_SCHEDULED_EVENTS
] });

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