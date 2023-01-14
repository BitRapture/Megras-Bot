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
        let deltaExp = Math.ceil((deltaCurrentExp / deltaNextExp) * 10);

        let progressBar = "".padStart(deltaExp, "X").padStart(10, "_");

        let embed = Bot.Templates.Embeds.Simple(`${memberNickname}'s rank profile`, `${levelInfo.level} **${progressBar}** ${levelInfo.level + 1}`, [
            { name: "Current EXP", value: `${levelInfo.experience}`, inline: true },
            { name: "Next level EXP", value: `${nextLevelExp}`, inline: true },
            { name: "EXP Needed", value: `${expRequired}`, inline: true }
        ]);

        await interaction.reply(embed);
    }
}