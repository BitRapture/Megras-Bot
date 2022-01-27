const Embed = require("../templates/embeds.js");

module.exports = {
	name : "alliance",
	desc : "Manage alliances",
	longdesc : "Create, disband, edit or join an alliance. It costs `100MAGS` to form an alliance",
	examples : [
		{ name: "Create an alliance", value: "`$alliance create <name>`" },
		{ name: "Disband an alliance", value: "`$alliance disband <name>`" },
		{ name: "Join an alliance", value: "`$alliance join <name>`" },
		{ name: "Show the alliance editor menu", value: "`$alliance edit`" }
	],
	visible : true,

    Run(Bot, args, message) {
        let embed = Embed.Malformed();
        if (args.length < 1) { message.reply({ embeds: [embed] }); return; }

        
    }

}