const Embed = require("../templates/embeds.js");

module.exports = {
    name : "level",
    desc : "Display your level",
    longdesc : "Displays your current level and experience gained",
    examples : [
        { name: "Display someone elses level", value: "`$level <@user>`" }
    ],
    visible : true,

    Run(Bot, args, message) {
        let member = message.mentions.members.first(); member = (member === undefined ? message.member : member);
        let nickname = (member.nickname === null ? member.user.username : member.nickname);

        // Get information
        let userExp = Bot.store.users.exp.get(member.id); userExp = (userExp === undefined ? 0 : userExp);
        let userLvl = Bot.store.users.lvl.get(member.id); userLvl = (userLvl === undefined ? 0 : userLvl);
        let nextLevel = Math.floor(((userLvl + 1) ** 1.6) * 500), prevLevel = (userLvl === 0 ? 0 : Math.floor(((userLvl) ** 1.6) * 500));

        // Convert to progress bar
        let progress = `**${userLvl} ` + "".padStart(Math.ceil(((userExp - prevLevel) / (nextLevel - prevLevel)) * 17), "▮").padEnd(17, "▯") + ` ${userLvl + 1}**`;
        let fields = [
            { name: "Current EXP", value: `${userExp}`, inline: true }, 
            { name: "EXP Left", value: `${nextLevel - userExp}`, inline: true },
            { name: "EXP Required", value: `${nextLevel}`, inline: true }
        ];

        message.reply({ embeds: [Embed.FieldEmbed(`${nickname}'s level profile`, progress, fields)] });
    }

}