const Embed = require("../templates/embeds.js");

module.exports = {
    name : "help",
    desc : "Shows all commands",
    longdesc : "Displays all visible commands in pages of 10 elements",
    examples : [
        { name: "Get specific page", value: "`$help <page>`" },
        { name: "Get specific command", value: "`$help <command>`" },
        { name: "Get first page", value: "`$help 1` or `$help`" }
    ],
    visible : true,

    Run(Bot, args, message) {
        // Get pages
        let pages = Math.ceil(Bot.commandsList.length / 10), pageNo = 0;
        if (args.length == 1) {
            if (!isNaN(args[0])) { pageNo = parseInt(args[0] - 1); pageNo = (pageNo < pages && pageNo >= 0 ? pageNo : 0); }
            else if (Bot.commands.has(args[0].toLowerCase())) { 
                // Lookup extra info on specific command
                let cmd = Bot.commands.get(args[0].toLowerCase());
                message.reply({ embeds: [Embed.FieldFooter(
                    `📘 Help menu: ${cmd.name}`, cmd.longdesc, cmd.examples, 
                    { text: `Command visible? ${cmd.visible ? "Yes" : "No" }`, iconURL: Bot.client.user.avatarURL() }
                )] });
                return;
             }
        }

        // Accumulate list
        let list = [];
        for (let i = (pageNo * 10); i < Bot.commandsList.length; ++i) {
            list.push({ name: `${Bot.config.prefix}${Bot.commandsList[i].name}`, value: "`"+Bot.commandsList[i].desc+"`", inline: false });
        }

        // Send list
        message.reply({ embeds: [Embed.FieldFooter(
            "📘 Help menu", "Use `"+`${Bot.config.prefix}`+"help <command>` for more info", 
            list, { text: `Page ${pageNo+1}/${pages}`, iconURL: Bot.client.user.avatarURL() }
        )] });
    }

}