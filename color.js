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


setInterval(() => {
    let color = "";
    if(hasPrime) {
        color = randomHex()
    } else {
        color = primeColor()
    }
    if (client_ready) {
        console.log(`${new Date().toLocaleTimeString()} | ${color}`)
        client.privmsg(username, `/color ${color}`);
    }
}, seconds * 1000)


setInterval(() => {
    let primeMessage = "Prime colors are off."
    if(hasPrime) {
        primeMessage = "Prime colors are on."
    }
    console.log(`${new Date().toLocaleTimeString()} | INFO - All messages are only sent to YOUR chat (#${username})`)
    console.log(`${new Date().toLocaleTimeString()} | INFO - ${primeMessage}`)
}, seconds * 10 * 1000)  // every 10 color changes, should always be on the screen

client.connect()
