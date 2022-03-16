const Embed = require("../templates/embeds.js");

module.exports = {
    name : "addlevelrole",
    desc : "Add a level role to a server",
    longdesc : "Add a level role to a server, must be a bot moderator",
    examples : [
        { name: "Add level role", value: "`$addlevelrole <roleName> <level>`" }
    ],
    visible : true,

    Run(Bot, args, message) {
        // Check user is a moderator of the bot
        if (!Bot.store.server.botMods.has(message.guildId)) { return; }
        let isMod = false;
        Bot.store.server.botMods.get(message.guildId).forEach((modId) => { 
            if (modId === message.author.id) { isMod = true; }
        })
        if (!isMod) { return; }

        let embed = Embed.Error("Malformed command");
        if (args.length < 2) { message.reply({ embeds: [embed] }); return; }

        embed = Embed.Error("Role doesn't exist");
        if (!message.guild.roles.cache.has(`${args[0]}`)) { message.reply({ embeds: [embed] }); return; }

        let level = parseInt(args[1]);
        embed = Embed.Error("Level must be greater than -1");
        if (level < 0) { message.reply({ embeds: [embed] }); return; }

        Bot.store.server.roleLevels.push(message.guildId, { "id": message.guild.roles.cache.get(`${args[0]}`), "level": level });
    }
}