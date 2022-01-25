const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");

const Embed = require("../templates/embeds.js");

module.exports = {
    name : "profile",
    desc : "Display your profile",
    longdesc : "Displays your profile and coin balance",
    examples : [
        { name: "Display someone elses profile", value: "`profile <@user>`" }
    ],
    visible : true,

    canvas: createCanvas(320, 150),
    ctx: this.canvas.getContext("2d"),

    Run(Bot, args, message) {
        message.channel.send({ content: `${message.author}`, embeds: [Embed.SimpleEmbed("Creating profile", "Please wait")] }).then((msg) => {
            loadImage("./src/media/profile.png").then((background) => {
                this.ctx.drawImage(background, 0, 0, 320, 150);
            });
            
            loadImage(message.author.displayAvatarURL({ format: "png", size: 128 })).then((profile) => {
                this.ctx.drawImage(profile, 10, 10, 119, 119);
            });

            loadImage("./src/media/profile overlay.png").then((overlay) => {
                this.ctx.drawImage(overlay, 0, 0, 320, 150);
            });
            
            let file = new MessageAttachment(this.canvas.toBuffer("image/png"), "profile.png");
            let embed = Embed.SimpleEmbed("Profile", `${message.member.nickname}'s profile`);
            embed.image = { url: file.url, width: 320, height: 150 };
            msg.edit({ content: `${message.author}`, embeds: [embed], files: [file] });
        })
    }
}