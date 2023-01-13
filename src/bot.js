const FS = require("node:fs");
const { Client, Events, GatewayIntentBits, REST, Routes } = require("discord.js");
// Create structure
const Bot = {
    Client : new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] }),
    Config : {
        Tokens : require("./private/tokens.json")
    },
    Commands : {
        Plain : new Map(),
        Slash : new Map()
    }
}
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

// Sync slash commands
const serializedSlashCommands = [];
Bot.Commands.Slash.forEach(command => {
    serializedSlashCommands.push(command.data.toJSON());
});
(async () => {
    try {
        console.log("GHOST > Syncing slash commands");

        const data = await Rest.put(
            Routes.applicationCommands(Bot.Config.Tokens.discordId),
            { body: serializedSlashCommands }
        );

        console.log(`GHOST > Successfully synced ${data.length} slash command(s)`);
    } catch (err) {
        console.error(err);
    }
})();

// Discord bot online
Bot.Client.on("ready", () => {
    console.log(`GHOST > Logged in as: ${Bot.Client.user.tag}`);
    console.log(`GHOST > Loaded ${Bot.Commands.Slash.size} slash commands`);
    console.log(`GHOST > Loaded ${Bot.Commands.Plain.size} plain commands`);
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

Bot.Client.login(Bot.Config.Tokens.discord);