const { MessageAttachment, MessageEmbed } = require("discord.js");
const { createCanvas, loadImage, registerFont } = require("canvas");
registerFont("./src/media/Pixel.ttf", { family: "Pixel" });
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

                loadImage(message.author.displayAvatarURL({ format: "png", size: 128 })).then((profile) => {
                    // Convert avatar to greyscale
                    CTX.save();
                    CTX.fillStyle = "#FFF";
                    CTX.fillRect(10, 10, 110, 110);
                    CTX.globalCompositeOperation = "luminosity";
                    CTX.drawImage(profile, 10, 10, 110, 110);
                    CTX.restore();

                    loadImage("./src/media/profile overlay.png").then((overlay) => {
                        CTX.drawImage(overlay, 0, 0, 320, 150);
                        CTX.font = "20px Pixel";

                        // Load player balance
                        let bal = (Bot.store.users.bal.has(message.author.id) ? Bot.store.users.bal.get(message.author.id) : 0);
                        bal.toString().substring(0, 6).padStart(7, "0");
                        CTX.fillText(bal, 162, 82);
                        
                        // Upload file and insert into embed
                        let file = new MessageAttachment(Canvas.toBuffer("image/png"), "profile.png");
                        let embed = new MessageEmbed({ title: `${message.member.nickname}'s profile`, color: 0x9B59B6 }).setImage("attachment://profile.png");
                        msg.edit({ content: `${message.author}`, embeds: [embed], files: [file] });
                    });
                });
            });
            
        })
    }
}