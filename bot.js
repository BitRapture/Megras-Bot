// DiscordJS API initialization
const { Client, Intents } = require("discord.js");
var Bot = { client : new Client({ intents: [
    Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, 
    Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES
] }) };

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
const CMDFiles = FS.readdirSync("./src/commands").filter(i => i.endsWith(".js"));
Bot.commands = new Map();
CMDFiles.forEach((file) => { const cmd = require(`./src/commands/${file}`); Bot.commands.set(cmd.name, cmd); } );

// API keys initialization
Bot.keys = require("./src/secret/keys.json");

// Config initialization
Bot.config = require("./src/config.json");

// Setup ready listener
Bot.client.on("ready", () => {
    console.log(`Logged into Discord as ${Bot.client.user.tag}`);
    console.log(`Loaded ${Bot.commands.size} commands`);
});

// Setup message listener
Bot.client.on("messageCreate", (message) => {
    if (message.author.bot) { return; }

    // Check server targets
    let inServer = false;
    for (const id in Bot.config.server_targets) { inServer |= (id == message.guildId); }
    if (!inServer) { return; }
    console.log("in server :)");

    // Streaming handling

    // Command handling
    if (!message.content.startsWith(Bot.config.prefix)) { return; }
    let args = message.content.slice(Bot.config.prefix).split(" ");
    let command = args.shift().toLowerCase();
    if (!Bot.commands.has(command)) { return; }
    try {
        Bot.commands.get(command).Run(Bot, args, message);
    } catch (err) {
        console.error(err);
    }

});

// Log into discord
Bot.client.login(Bot.keys.token);