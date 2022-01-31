const Cooldown = new Map();
var expCountDown = 2;

module.exports = {

    Run(Bot, message) {
        if (--expCountDown > 0 || Cooldown.has(message.author.id) && Cooldown.get(message.author.id) > +new Date()) { return; }
        let userExp = Bot.store.users.exp.get(message.author.id); userExp = (userExp === undefined ? 0 : userExp);
        let userLvl = Bot.store.users.lvl.get(message.author.id); userLvl = (userExp === undefined ? 0 : userLvl);

        // Calculate next experience drop
        expCountDown = Math.floor((Math.random() * 14) + 1); // 1 - 15

        // Get experience, check level up
        userExp += Math.floor((Math.random() * 249) + 1); // 1 - 250
        let nextLevel = ((userLvl + 1) * 250);
        if (userExp >= nextLevel) { 

            message.react("852713593191006208"); // Custom emoji
        }
    }

}