// Meta bot controller
const { fork, execSync } = require("child_process");

// Run the bot process
var BotProcess = fork("./bot.js", [], { silent: true });

// Setup bot close listener
BotProcess.on("close", (code) => {
    switch (code)
    {
        case 2: // Update and restart the bot
            console.log("Updating the bot through Discord...");
            execSync("sh ./update.sh");
        break;
    }
});

// Setup stdout errors
BotProcess.stderr.on("data", (err) => {
    console.error(`${err}`);
});

// Setup stdout data
BotProcess.stdout.on("data", (data) => {
    console.log(`${data}`);
});