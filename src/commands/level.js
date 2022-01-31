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

        let userExp = Bot.store.users.exp.get(member.id); userExp = (userExp === undefined ? 0 : userExp);
        let userLvl = Bot.store.users.lvl.get(member.id); userLvl = (userExp === undefined ? 0 : userLvl);
        let nextLevel = ((userLvl + 1) * 500);

        let progress = `**${userLvl} ` + "".padStart(Math.ceil((userLvl / nextLvl) * 10), "|").padEnd(10, "-") + ` ${nextLevel}**`;
        let fields = [{ name: "Current EXP", value: userExp }, { name: "EXP Required", value: nextLevel }];

        message.reply({ embeds: [Embed.FieldEmbed(`${nickname}'s level profile`, progress, fields)] });
    }

}