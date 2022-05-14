const Embed = require("../templates/embeds.js");
const EXP = require("../templates/exp.js");

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
        if (!message.guild.members.cache.has(`${args[0]}`)) { message.reply({ embeds: [embed] }); return; }

        let level = parseInt(args[1]);
        embed = Embed.Error("Level must be greater than -1");
        if (level < 0 || isNaN(level)) { message.reply({ embeds: [embed] }); return; }
        
        embed = Embed.SimpleEmbed("Level set successfully", `Set user to level ${level}`);
        Bot.store.users.exp.set(`${args[0]}`, EXP.GetExperience(level));
        Bot.store.users.lvl.set(`${args[0]}`, level);

        message.reply({ embeds: [embed] });
    }

}