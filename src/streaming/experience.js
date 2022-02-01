const Cooldown = new Map(); // Todo, add a cleanup routine that checks old cooldowns and removes them from memory
var expCountDown = 2;

module.exports = {

    Run(Bot, message) {
        if (--expCountDown > 0 || Cooldown.has(message.author.id) && Cooldown.get(message.author.id) > +new Date()) { return; }
        let userExp = Bot.store.users.exp.get(message.author.id); userExp = (userExp === undefined ? 0 : userExp);
        let userLvl = Bot.store.users.lvl.get(message.author.id); userLvl = (userLvl === undefined ? 0 : userLvl);

        // Add to cooldown
        let minute = new Date(); minute.setUTCSeconds(minute.getUTCSeconds() + 60);
        Cooldown.set(message.author.id, +minute);

        // Calculate next experience drop
        expCountDown = Math.floor((Math.random() * 5) + 1); // 1 - 6

        // Get experience
        userExp += Math.floor((Math.random() * 249) + 1); // 1 - 250
        Bot.store.users.exp.set(message.author.id, userExp);

        // Check level up
        let nextLevel = Math.floor(((userLvl + 1) ** 1.6) * 500);
        if (userExp >= nextLevel) { 
            // Increase balance
            let bal = Bot.store.users.bal.get(message.author.id); bal = (bal === undefined ? 0 : bal);
            Bot.store.users.bal.set(message.author.id, bal + Math.floor((Math.random() * 9) + 1)); // 1 - 10

            // Increase level
            Bot.store.users.lvl.set(message.author.id, (userLvl + 1));
            message.react(Bot.config.customEmojis.LevelUp);
        }
    }

}