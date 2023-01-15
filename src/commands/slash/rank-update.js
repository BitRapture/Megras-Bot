const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
        .setName("rank-update")
        .setDescription("Update a member's rank")
        .addSubcommand(subcommand => 
            subcommand
                .setName("set-level")
                .setDescription("Set member's rank level")
                .addUserOption(option =>
                    option
                        .setName("member")
                        .setDescription("Server member to update"))
                .addIntegerOption(option =>
                    option
                        .setName("level")
                        .setDescription("Level to set to")))
        .addSubcommand(subcommand => 
            subcommand
                .setName("add-exp")
                .setDescription("Add experience to member's rank")
                .addUserOption(option =>
                    option
                        .setName("member")
                        .setDescription("Server member to update"))
                .addIntegerOption(option =>
                    option
                        .setName("experience")
                        .setDescription("Experience to add")))  
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(Bot, interaction) {
        let member = interaction.options.getMember("member");
        let memberNickname = member.nickname ?? member.user.username;
        let levelInfo = Bot.Templates.Levels.GetUserInfo(member.id, Bot.Store.Users.Rank);

        let embedTitle = `Updating ${memberNickname}'s rank profile`;
        let embedDesc = "";

        switch (interaction.getSubcommand()) {
            case "set-level":
                let level = interaction.options.getInteger("level");
                embedDesc = "Level must be greater than or equal to 0";
                if (level >= 0) {
                    embedDesc = `Level set from \`${levelInfo.level}\` to \`${level}\``;
                    levelInfo.level = level;
                    levelInfo.experience = Bot.Templates.Level.GetLevelExperience(level);
                    Bot.Store.Users.Rank.set(levelInfo);
                }
                break;
            case "add-exp":
                let experience = interaction.options.getNumber("experience");
                embedDesc = "Experience must be greater than 0";
                if (experience > 0) {
                    let allExperience = levelInfo.experience + experience;
                    let newLevel = levelInfo.level;
                    while (Bot.Templates.Levels.GetLevelExperience(newLevel) < allExperience)
                    {
                        newLevel++;
                    }
                    embedDesc = `Experience added: \`${levelInfo.experience}\` + \`${experience}\` = \`${allExperience}\``;
                    levelInfo.level = newLevel;
                    levelInfo.experience += experience;
                    Bot.Store.Users.Rank.set(levelInfo);
                }
                break;
        }

        await interaction.reply(Bot.Templates.Embeds.Simple(embedTitle, embedDesc));
    }
}