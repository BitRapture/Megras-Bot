const Embed = require("../templates/embeds.js");

module.exports = {
	name : "alliance",
	desc : "Manage alliances",
	longdesc : "Create, disband, edit, join or leave an alliance. It costs `100MAGS` to form an alliance, and `5MAGS` to join an alliance.\
    Disbanding an alliance will give you a payout based on its level, multiplier and member count (Members are entitled to some of this too)",
	examples : [
		{ name: "Display your alliance profile", value: "`$alliance`" },
		{ name: "Display an alliance profile", value: "`$alliance view <name>`" },
		{ name: "Create an alliance", value: "`$alliance create <name>`" },
		{ name: "Disband an alliance", value: "`$alliance disband <name>`" },
		{ name: "Join an alliance", value: "`$alliance join <name>`" },
		{ name: "Leave an alliance", value: "`$alliance leave <name>`" },
		{ name: "Show the alliance editor menu", value: "`$alliance edit`" }
	],
	visible : true,

    DisplayProfile(Bot, userAly) {
        let embed;
        if (userAly === "") { embed = Embed.SimpleEmbed("Aliance profile: no alliance", `Join an alliance with \`${Bot.config.prefix}alliance join <name>\``); }
        else { 
            let fields = [
                { name: "Member count", value: `${Bot.store.alliances.list.get(userAly).length}`, inline: true },
                { name: "Level", value: `${Bot.store.alliances.lvl.get(userAly)}`, inline: true },
                { name: "Experience", value: `${Bot.store.alliances.exp.get(userAly)}`, inline: true },
                { name: "Multiplier", value: `${Bot.store.alliances.mult.get(userAly)}`, inline: true },
                { name: "Owner?", value: `${(message.author.id === Bot.store.alliances.owner.get(userAly) ? "True" : "False")}`, inline: true }
            ]
            embed = Embed.FieldEmbed(`Alliance profile: ${userAly}`, `Information for the alliance, \`${userAly}\``, fields); 
        }
        return embed;
    },

    Run(Bot, args, message) {
        let embed = Embed.Malformed();
        let userAly = Bot.store.users.aly.get(message.author.id); userAly = (userAly === undefined ? "" : userAly);
        let userBal = Bot.store.users.bal.get(message.author.id); userBal = (userBal === undefined ? 0 : userBal);

        // Display alliance profile
        if (args.length < 1) { message.reply({ embeds: [this.DisplayProfile(Bot, userAly)] }); return; } 
        else if (args.length < 2) { message.reply({ embeds: [embed] }); return; } // Malformed

        let alyName = args[1].replace(/[^a-zA-Z0-9_\- ]/g, "");
        if (alyName.length < 3) { embed = Embed.Error("An alliance name must be at least 3 characters long"); return; }
        else if (alyName.length >= 31) { embed = Embed.Error("An alliance name cannot be longer than 30 characters"); return; }

        switch (args[0].toLowerCase())
        {
            case "view":
                if (!Bot.store.alliances.owner.has(alyName)) { embed = Embed.Error("Alliance doesn't exist"); break; } 
                
                embed = this.DisplayProfile(Bot, alyName);
            break;

            case "create":
                if (userAly !== "") { embed = Embed.Error("Already in an alliance, leave or disband"); break; }
                if (userBal < 100) { embed = Embed.Error("Insufficient funds, `100MAGS` required"); break; }
                if (Bot.store.alliances.list.has(alyName)) { embed = Embed.Error(`Alliance already exists`); break; }
                
                // Deduct balance
                Bot.store.users.bal.set(message.author.id, userBal - 100);
                
                // Create alliance
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
                if (message.author.id !== Bot.store.alliances.owner.get(alyName)) { embed = Embed.Error(`You don't own ${alyName}`); break; }

                let list = Bot.store.alliances.list.get(alyName);
                let mult = Bot.store.alliances.mult.get(alyName);
                let payout = Math.floor((Bot.store.alliances.lvl.get(alyName) * mult) + (list.length * mult));
                let memberPay = Math.ceil((payout / (list.length / 2)) + (5 * mult));

                // Pay and remove all alliance members
                list.forEach((uid) => { 
                    Bot.store.users.aly.set(uid, ""); 
                    if (uid !== message.author.id) { 
                        let mBal = Bot.store.users.bal.get(uid); mBal = (mBal === undefined ? 0 : mBal);
                        Bot.store.users.bal.set(uid, mBal + memberPay); 
                    }
                });

                // Delete alliance
                Bot.store.alliances.list.delete(alyName);
                Bot.store.alliances.owner.delete(alyName);
                Bot.store.alliances.mult.delete(alyName);
                Bot.store.alliances.lvl.delete(alyName);
                Bot.store.alliances.exp.delete(alyName); // todo (maybe change this to an array system for dynamic deletion)

                // Pay owner
                Bot.store.users.bal.set(message.author.id, userBal + payout);

                embed = Embed.SimpleEmbed("Alliance disbanded successfully", `Received \`${payout}MAGS\`, members received \`${memberPay}MAGS\``);
            break;

            case "join":
                if (userAly !== "") { embed = Embed.Error("Already in an alliance, leave or disband"); break; }
                if (!Bot.store.alliances.owner.has(alyName)) { embed = Embed.Error("Alliance doesn't exist"); break; } 
                if (userBal < 5) { embed = Embed.Error("Insufficient funds, `5MAGS` required"); break; }
                
                // Deduct balance
                Bot.store.users.bal.set(message.author.id, userBal - 5);

                // Add user to member list
                Bot.store.users.aly.set(message.author.id, alyName);
                Bot.store.alliances.list.push(alyName, message.author.id);

                embed = Embed.SimpleEmbed("Joined alliance", `You are now a member of \`${alyName}\``);
            break;

            case "leave":
                if (userAly === "") { embed = Embed.Error("Not in an alliance"); break; }
                if (!Bot.store.alliances.owner.has(alyName)) { embed = Embed.Error("Alliance doesn't exist"); break; } 
                if (Bot.store.alliances.list.get(alyName).find(uid => message.author.id === uid) === undefined) { embed = Embed.Error("Not a member of this alliance"); break; } 

                // Remove user from member list
                Bot.store.users.aly.set(message.author.id, "");
                Bot.store.alliances.list.remove(alyName, message.author.id);
                
                embed = Embed.SimpleEmbed("Left alliance", `You are no longer a member of \`${alyName}\``);
            break;

            case "edit":
                embed = Embed.SimpleEmbed("To be added", "SoonTM");
            break;
        }

        message.reply({ embeds: [embed] });
    }

}