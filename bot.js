// DiscordJS API initialization
const { DJSClient, DJSInt } = require("discord.js");
var Bot = {};
Bot.client = new DJSClient({ intents: [
    DJSInt.FLAGS.GUILDS,
    DJSInt.FLAGS.GUILDS_MEMBERS,
    DJSInt.FLAGS.GUILD_BANS,
    DJSInt.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    DJSInt.FLAGS.GUILD_INTEGRATIONS,
    DJSInt.FLAGS.GUILD_WEBHOOKS,
    DJSInt.FLAGS.GUILD_INVITES,
    DJSInt.FLAGS.GUILD_VOICE_STATES,
    DJSInt.FLAGS.GUILD_PRESENCES,
    DJSInt.FLAGS.GUILD_MESSAGES,
    DJSInt.FLAGS.GUILD_MESSAGE_REACTIONS,
    DJSInt.FLAGS.GUILD_MESSAGE_TYPING,
    DJSInt.FLAGS.DIRECT_MESSAGES,
    DJSInt.FLAGS.DIRECT_MESSAGE_REACTIONS,
    DJSInt.FLAGS.DIRECT_MESSAGE_TYPING,
    DJSInt.FLAGS.GUILD_SCHEDULED_EVENTS
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