const Embed = require("../templates/embeds.js");

module.exports = {
    name : "help",
    desc : "Shows all commands",
    visible : true,

    Run(Bot, args, message) {
        let pages = Math.ceil(Bot.commandsList.length / 10), pageNo = 0;
        if (args.length == 1) {
            if (!isNaN(args[0])) {
                pageNo = parseInt(args[0]);
            }
        }

        // Accumulate list
        let list = [];
        for (let i = (pageNo * 10); i < Bot.commandsList.length; ++i) {
            list.push({ name: Bot.commandsList[i].name, value: "`"+Bot.commandsList[i].desc+"`", inline: false });
        }

        message.channel.send(`${message.author}`, { embeds: [Embed.FieldEmbed("Help menu", `[Page ${pageNo+1} out of ${pages+1}]`, list)] });
    }

}