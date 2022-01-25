
module.exports = {
    name : "dev",
    desc : "The developer interface",
    visible : false,

    Run(Bot, args, message) {
        if (message.author.id !== Bot.config.devId) { return; }
        if (args.length <= 0) { return; }
        // Run through developer commands
        switch (args[0].toLowerCase())
        {
            case "update":
                Bot.store.dev.set("update", { recent: true, issuer: `${message.author}`, channel: message.channel.id, guild: message.guildId });
                process.exit(2);
            break;
            case "eval":
                args.shift();
                eval(args.join(" "));
            break;
        }
    }
}