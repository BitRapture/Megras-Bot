const { SlashCommandBuilder, messageLink } = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Get your or another member's server rank information")
        .addUserOption(option =>
            option.setName("member")
                .setDescription("Server member to check")),
    async execute(Bot, interaction) {
        let member = interaction.options.getMember("member") ?? interaction.member;
        let memberNickname = member.nickname ?? member.user.username;
        let levelInfo = Bot.Templates.Levels.GetUserInfo(member.id, Bot.Store.Users.Rank);

        let embed = Bot.Templates.Embeds.Simple(`${memberNickname}'s rank profile`, `Currently level ${levelInfo.level}`, [
            { name: "Current EXP", value: levelInfo.experience, inline: true }
        ]);

        await interaction.reply(embed);
    }
}