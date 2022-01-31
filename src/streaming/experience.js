const Cooldown = new Map();
var expCountDown = 2;

module.exports = {

    Run(Bot, message) {
        if (--expCountDown > 0 || Cooldown.has(message.author.id) && Cooldown.get(message.author.id) ) { return; }
        let userExp
    }

}