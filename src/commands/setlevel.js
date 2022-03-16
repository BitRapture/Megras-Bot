const Embed = require("../templates/embeds.js");


module.exports = {
    name : "setlevel",
    desc : "Set a users level",
    longdesc : "Set another server members level, must be a bot moderator",
    examples : [
        { name: "Set level by user id", value: "`$setlevel <id> <level>`" }
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

        embed = Embed.Error("User isn't in this guild");
        if (!essage.guild.members.cache().has(`${args[0]}`)) { message.reply({ embeds: [embed] }); return; }

        let level = ParseInt(args[1]);
        embed = Embed.Error("Level must be greater than -1");
        if (level < 0) { message.reply({ embeds: [embed] }); return; }
        
        Bot.store.users.exp.set(message.author.id, Math.floor(((level) << 2) * 650));
        Bot.store.users.lvl.set(message.author.id, level);
    }

}