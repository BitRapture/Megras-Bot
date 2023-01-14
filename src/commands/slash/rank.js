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

        let currentLevelExp = Bot.Templates.Levels.GetLevelExperience(levelInfo.level);
        let nextLevelExp = Bot.Templates.Levels.GetLevelExperience(levelInfo.level + 1);
        let expRequired = nextLevelExp - levelInfo.experience;
        let deltaCurrentExp = levelInfo.experience - currentLevelExp;
        let deltaNextExp = nextLevelExp - currentLevelExp;
        let deltaExp = Math.ceil((deltaCurrentExp / deltaNextExp) * 6);

        let progressBar = "".padStart(deltaExp, "X").padEnd(6 - deltaExp, "_");

        let embed = Bot.Templates.Embeds.Simple(`${memberNickname}'s rank profile`, `${levelInfo.level} ${progressBar} ${levelInfo.level + 1}`, [
            { name: "Current EXP", value: `${levelInfo.experience}`, inline: true },
            { name: "EXP required for rank up", value: `${expRequired}`, inline: true }
        ]);

        await interaction.reply(embed);
    }
}