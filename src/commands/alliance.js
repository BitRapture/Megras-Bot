const Embed = require("../templates/embeds.js");

module.exports = {
	name : "alliance",
	desc : "Manage alliances",
	longdesc : "Create, disband, edit, join or leave an alliance. It costs `100MAGS` to form an alliance",
	examples : [
		{ name: "Display alliance profile", value: "`$alliance`" },
		{ name: "Create an alliance", value: "`$alliance create <name>`" },
		{ name: "Disband an alliance", value: "`$alliance disband <name>`" },
		{ name: "Join an alliance", value: "`$alliance join <name>`" },
		{ name: "Leave an alliance", value: "`$alliance leave <name>`" },
		{ name: "Show the alliance editor menu", value: "`$alliance edit`" }
	],
	visible : true,

    Run(Bot, args, message) {
        let embed = Embed.Malformed();
        let userAly = Bot.store.users.aly.get(message.author.id); userAly = (userAly === undefined ? "" : userAly);
        let userBal = Bot.store.users.bal.get(message.author.id); userBal = (userBal === undefined ? 0 : userBal);

        // Display alliance profile
        if (args.length < 1) {
            if (userAly === "") { embed = Embed.SimpleEmbed("Aliance profile: no alliance", "Join an alliance with"+`${Bot.config.prefix}alliance join <name>`); }
            else { 
                embed = Embed.SimpleEmbed(`Alliance profile: ${userAly}`, "Data will be showed here when there is things to do in the future :)"); 
            }
            message.reply({ embeds: [embed] });
            return;
        } else if (args.length < 2) { return; } // Malformed

        let alyName = args[1].replace(/[^a-zA-Z ]/g, "");
        if (alyName.length < 3) { embed = Embed.Error("An alliance name must be at least 3 characters long"); return; }

        switch (args[0].toLowerCase())
        {
            case "create":
                if (userAly !== "") { embed = Embed.Error("Already in an alliance, leave or disband"); break; }
                if (userBal < 100) { embed = Embed.Error("Insufficient funds, `100MAGS` required"); break; }
                if (Bot.store.alliances.list.has(alyName)) { embed = Embed.Error(`The alliance ${alyName} already exists`); break; }
                
                Bot.store.users.bal.set(message.author.id, userBal - 100);
                Bot.store.users.aly.set(message.author.id, alyName);

                Bot.store.alliances.list.set(alyName, [message.author.id]);
                Bot.store.alliances.owner.set(alyName, message.author.id);
                Bot.store.alliances.mult.set(alyName, 1);
                Bot.store.alliances.lvl.set(alyName, 1);
                Bot.store.alliances.exp.set(alyName, 0);

                embed = Embed.SimpleEmbed("Alliance created successfully", `You're now the owner of ${alyName}`);
            break;

            case "disband":
                if (!Bot.store.alliances.owner.has(alyName)) { embed = Embed.Error("Alliance doesn't exist"); break; } 
                if (userAly === "") { embed = Embed.Error("You don't own an alliance"); break; }
                if (message.author.id !== Bot.store.alliances.owner.get(alyName)) { embed = Embed.Error(`You don't own ${alyName}`); break; }

                let list = Bot.store.alliances.list.get(alyName);
                list.forEach((uid) => { Bot.store.users.aly.set(uid, ""); });
                Bot.store.alliances.list.delete(alyName);
                Bot.store.alliances.owner.delete(alyName);
                Bot.store.alliances.mult.delete(alyName);
                Bot.store.alliances.lvl.delete(alyName);
                Bot.store.alliances.exp.delete(alyName);

                embed = Embed.SimpleEmbed("Alliance disbanded successfully", `${alyName} can be reclaimed by anyone`);
            break;

            case "join":

            break;

            case "leave":

            break;

            case "edit":
                embed = Embed.SimpleEmbed("To be added", "SoonTM");
            break;
        }

        message.reply({ embeds: [embed] });
    }

}