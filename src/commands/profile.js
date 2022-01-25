const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const Canvas = createCanvas(320, 150);
const CTX = Canvas.getContext("2d");

const Embed = require("../templates/embeds.js");

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
            loadImage("./src/media/profile.png").then((background) => {
                CTX.drawImage(background, 0, 0, 320, 150);
            });
            
            loadImage(message.author.avatarURL).then((profile) => {
                CTX.drawImage(profile, 10, 10, 119, 119);
            });

            loadImage("./src/media/profile overlay.png").then((overlay) => {
                CTX.drawImage(overlay, 0, 0, 320, 150);
            });
            
            let file = new MessageAttachment(Canvas.toBuffer("image/png"), "profile.png");
            let embed = Embed.SimpleEmbed("Profile", `${message.member.nickname}'s profile`);
            embed.image = { url: file.url, width: 320, height: 150 };
            msg.edit({ content: `${message.author}`, embeds: [embed], files: [Canvas.toBuffer()] });
        })
    }
}