/* 
    Hello to run this script you need nodejs & npm installed.
    You also need to install dank-twitch-irc with the command 
    `npm i dank-twitch-irc` before you run this :)

    You can edit the things below here to suit your needs.
*/


const config = require("./config");

// script
const ircLib = require("dank-twitch-irc");
const bot_config = {
    username: config.username, // justinfan12345 by default - For anonymous chat connection
    password: config.oauth, // undefined by default (no password)
}
const client = new ircLib.ChatClient(bot_config);
let client_ready = false;
function randInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

client.on("ready", () => {
    console.log(`${new Date().toLocaleTimeString()} | INFO - Connected to chat and ready to send colors.`)
    client_ready = true;
    showInfo()
})  

function randomHex() {
    let out = "#";
    const hexLetters = "0123456789abcdef"

    for(i = 0;i < 6;i++) {
        // chooses one random letter 6 times
        out += hexLetters[randInt(hexLetters.length)]
    }

    return out;
}


function primeColor() {
    let out = "";
    const primeColors = ["Blue", "BlueViolet", "CadetBlue", "Chocolate", "Coral", "DodgerBlue", "Firebrick", "GoldenRod", "Green", "HotPink", "OrangeRed", "Red", "SeaGreen", "SpringGreen", "YellowGreen"];
    
    // just pick one at random
    out += primeColors[randInt(primeColors.length)];

    return out;
}

function showInfo() {
    let primeMessage = "Prime colors are off, if you would like to have more colors, turn it on. (Requires Prime/Turbo)"
    if(config.hasPrime) {
        primeMessage = "Prime colors are on. If its not doing anything, try turning them off."
    }
    console.log(`${new Date().toLocaleTimeString()} | INFO - All commands are only sent to YOUR chat (#${config.username})`)
    console.log(`${new Date().toLocaleTimeString()} | INFO - ${primeMessage}`)
}

setInterval(() => {
    let color = "";
    if(config.hasPrime) {
        color = randomHex()
    } else {
        color = primeColor()
    }
    if (client_ready) {
        console.log(`${new Date().toLocaleTimeString()} | ${color}`)
        client.privmsg(config.username, `/color ${color}`);
    }
}, config.seconds * 1000)


setInterval(showInfo, config.seconds * 10 * 1000)  // every 10 color changes, so it should always be on the screen

console.log(`${new Date().toLocaleTimeString()} | THANKS - Thanks for using my colorchanger, inspired by turtoise's version.`)
console.log(`${new Date().toLocaleTimeString()} | CREDIT - This color changing script was made by QuinnDT and can be found at twitch.tv/quinndt in chat.`)
console.log(`${new Date().toLocaleTimeString()} | INFO - Connecting...`)
client.connect()
