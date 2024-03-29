
module.exports = {
    name : "dev",
    desc : "The developer interface",
    longdesc : "This command is supposed to be invisible >:(",
    examples : [
        { name: "You get NO EXAMPLES", value: "`Get owned!`" }
    ],
    visible : false,

    Run(Bot, args, message) {
        if (message.author.id !== Bot.config.devId) { return; }
        if (args.length <= 0) { return; }
        // Run through developer commands
        switch (args[0].toLowerCase())
        {
            case "push":
            case "up":
            case "update":
                Bot.store.dev.set("update", { recent: true, issuer: `${message.author}`, channel: message.channel.id, guild: message.guildId });
                process.exit(2);
            break;
            case "eval":
                args.shift();
                eval(args.join(" "));
            break;
            case "dellvl":
                Bot.store.users.exp.forEach((v, k) => {Bot.store.users.exp.delete(k)});
                Bot.store.users.lvl.forEach((v, k) => {Bot.store.users.lvl.delete(k)});
                message.reply("Deleted everything");
            break;
            case "loadrolelevels":
            case "loadrolelvls":
            case "lrl":
                // Load level roles from config json to cache
                Bot.config.roleLevels.forEach((server) => {
                    Bot.store.server.roleLevels.set(server.id, []);
                    server.pairs.forEach((pair) => {
                        let rID = Bot.client.guilds.cache.get(server.id).roles.cache.find((role) => { return role.name === pair.role; }).id;
                        if (rID !== undefined)
                        {
                            Bot.store.server.roleLevels.push(server.id, {
                                id : rID,
                                lvl : pair.level
                        });
                        }
                    });
                });
                message.reply("Updated and added to cache");
            break;
            case "givelvlroles":
            case "glr":
                // Add all server level roles
                let member = message.mentions.members.first();
                let userLvl = Bot.store.users.lvl.get(member.id); userLvl = (userLvl === undefined ? 0 : userLvl);
                let shRoles = Bot.store.server.roleLevels.has(message.guildId);
                if (shRoles)
                {  
                    let rServer = Bot.store.server.roleLevels.get(message.guildId);
                    rServer.forEach((pair) => {
                        if (pair.lvl <= userLvl) {
                            member.roles.add(pair.id, `User has been given their role rewards`);
                        }
                    });
                }
            break;
        }
    }
}