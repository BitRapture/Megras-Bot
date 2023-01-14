
module.exports = {
    async execute(Bot, message, args) {
        let levelInfo = Bot.Templates.Levels.GetUserInfo(message.member.id, Bot.Store.Users.Rank);
        let nextLevelExp = Bot.Templates.Levels.GetLevelExperience(levelInfo.level + 1);

        levelInfo.experience += Bot.Templates.Levels.GiveExperience();

        if (levelInfo.experience >= nextLevelExp) {
            levelInfo.level += 1;

            message.reply(Bot.Templates.Embeds.Simple("Rank up!", `You're now level ${levelInfo.level}`));
        }

        Bot.Store.Users.Rank.set(message.member.id, levelInfo);
    }
}