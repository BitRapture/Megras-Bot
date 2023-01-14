const FS = require("node:fs");
const { Client, Events, GatewayIntentBits, REST, Routes } = require("discord.js");
const Enmap = require("enmap");
// Create structure
const Bot = {
    Client : new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] }),
    Config : {
        Tokens : require("./private/tokens.json"),
        General : require("./private/config.json")
    },
    Commands : {
        Plain : new Map(),
        Slash : new Map(),
        Monitor : []
    },
    Store : {
        Users : {
            Rank : new Enmap({ name: "userRank", fetchAll: false, dataDir: "./private/store" })
        }
    },
    Templates : {
        Levels : require("./templates/user-levelling.js"),
        Embeds : require("./templates/embeds.js")
    }
}
const botName = Bot.Config.General.botName;
const Rest = new REST({ version: "10" }).setToken(Bot.Config.Tokens.discord);

// Accumulate all the commands
const slashCommandPath = "./commands/slash";
var slashCommandFiles = FS.readdirSync(slashCommandPath).filter(file => file.endsWith(".js"));
const slashCMDPaths = slashCommandFiles.map(file => file = `${slashCommandPath}/${file}`);

const plainCommandPath = "./commands/plain";
var plainCommandFiles = FS.readdirSync(plainCommandPath).filter(file => file.endsWith(".js"));
const plainCMDPaths = plainCommandFiles.map(file => file = `${slashCommandPath}/${plain}`);

const allCommandFiles = slashCMDPaths.concat(plainCMDPaths);

// Save to bot struct
allCommandFiles.forEach(commandFile => {
    const command = require(commandFile);
    // Inspect if the command is a slash command
    if ("data" in command && "execute" in command) {
        Bot.Commands.Slash.set(command.data.name, command);
    // Otherwise add to plain text command table
    } else if ("execute" in command) {
        Bot.Commands.Plain.set(command.data.name, command);
    }
});

// Save monitoring scripts to bot struct
const monitorScriptsPath = "./commands/monitor";
var monitorScriptFiles = FS.readdirSync(monitorScriptsPath).filter(file => file.endsWith(".js"));

monitorScriptFiles.forEach(monitorFile => {
    const monitorScript = require(`${monitorScriptsPath}${monitorFile}`);
    if ("execute" in monitorScript) Bot.Commands.Monitor.push(monitorScript);
})

// Sync slash commands
const serializedSlashCommands = [];
Bot.Commands.Slash.forEach(command => {
    serializedSlashCommands.push(command.data.toJSON());
});
(async () => {
    try {
        console.log("${botName} > Syncing slash commands");

        const data = await Rest.put(
            Routes.applicationCommands(Bot.Config.Tokens.discordId),
            { body: serializedSlashCommands }
        );

        console.log(`${botName} > Successfully synced ${data.length} slash command(s)`);
    } catch (err) {
        console.error(err);
    }
})();

// Discord bot online
Bot.Client.on("ready", () => {
    console.log(`${botName} > Logged in as: ${Bot.Client.user.tag}`);
    console.log(`${botName} > Loaded ${Bot.Commands.Slash.size} slash commands`);
    console.log(`${botName} > Loaded ${Bot.Commands.Plain.size} plain commands`);
    console.log(`${botName} > Loaded ${Bot.Commands.Monitor.length} monitoring commands`);
});

// Slash command interaction handler
Bot.Client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = Bot.Commands.Slash.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(Bot, interaction);
    } catch (err) {
        console.log(err);
    }
});

// Plain command interaction handler
Bot.Client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;
    let args = message.content.slice(Bot.Config.General.prefix.length).split(" ");
    let commandName = args.shift().toLowerCase();
    
    // Run through monitoring
    Bot.Commands.Monitor.forEach(monitor => {
        monitor.execute(Bot, message, args);
    });

    // Try and get relevant command
    const command = Bot.Commands.Plain.get(commandName);
    if (!command) return;

    try {
        await command.execute(Bot, message, args);
    } catch (err) {
        console.log(err);
    }
});

Bot.Client.login(Bot.Config.Tokens.discord);