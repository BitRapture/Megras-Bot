const { createCanvas, loadImage } = require("canvas");
const Canvas = createCanvas(320, 150);
const CTX = Canvas.getContext("2d");

const Embed = require("../templates/embeds.js");

const Background = loadImage("./src/media/profile.png");
const Overlay = loadImage("./src/media/profile overlay.png");

module.exports = {
    name : "profile",
    desc : "Display your profile",
    longdesc : "Displays your profile and coin balance",
    examples : [
        { name: "Display someone elses profile", value: "`profile <@user>`" }
    ],
    visible : true,

    Run(Bot, args, message) {
        message.channel.send({ content: `${message.author}`, embeds: [Embed.SimpleEmbed("Creating profile", "Please wait")] }).then((msg) => {
            CTX.drawImage(Background, 0, 0);
            
            let profile = loadImage(message.author.avatarURL).then(() => {
                CTX.drawImage(profile, 10, 10, 119, 119);
            });

            CTX.drawImage(Overlay, 0, 0);
            
            let embed = Embed.SimpleEmbed("Profile", `${message.member.nickname}'s profile`);
            embed.image = { url: Canvas.toDataURL(), width: 320, height: 150 };
            msg.edit({ content: `${message.author}`, embeds: [embed] });
        })
    }
}