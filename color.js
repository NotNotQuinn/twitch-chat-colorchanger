const config = require("./config");
const ircLib = require("dank-twitch-irc");
const Color = require('color');
var rainbowColor = Color('hsl(0, 60%, 50%)');
rainbowColor = rainbowColor.rotate(config.rainbowStartHue);
const bot_config = {
    username: config.username, // justinfan12345 by default - For anonymous chat connection
    password: config.oauth, // undefined by default (no password)
}
let client_ready = false;
const client = new ircLib.ChatClient(bot_config);
let colors_sent = 0;



// Generates a random number from 0-limit (number will never = limit, e.g. `randInt(1)` always gives 0) 
function randInt(limit) {
    return Math.floor(Math.random() * Math.floor(limit));
}

client.on("ready", () => {
    // when the client is ready, say that we've connected, tell the program its connected, and send information about configiration.
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

function rainbowHex() {
    rainbowColor = rainbowColor.rotate(config.rainbowSpeed);  // increaces the hue by the speed, think of it like rotating it on the color wheel.
    
    return rainbowColor.hex()
}


function nonPrimeColor() {
    let out = "";
    const primeColors = ["Blue", "BlueViolet", "CadetBlue", "Chocolate", "Coral", "DodgerBlue", "Firebrick", "GoldenRod", "Green", "HotPink", "OrangeRed", "Red", "SeaGreen", "SpringGreen", "YellowGreen"];
    
    // just pick one at random
    out += primeColors[randInt(primeColors.length)];
    
    return out;
}

function showInfo() {
    let primeMessage = "Prime colors are off, if you would like to have more colors, turn it on. (Requires Prime/Turbo)"
    if(config.usePrimeColors) {
        primeMessage = "Prime colors are on. If its not doing anything, try turning them off."
    }
    if(config.useRainbow) {
        let rainbowMessage = `Rainbow is on. Speed: ${config.rainbowSpeed}`;
        if (!config.usePrimeColors) {
            rainbowMessage = "Rainbow is on, but prime colors are off. Using random defalt color."
        }
        console.log(`${new Date().toLocaleTimeString()} | INFO - ${rainbowMessage}`)
    }
    console.log(`${new Date().toLocaleTimeString()} | INFO - All commands are only sent to YOUR chat (#${config.username})`)
    console.log(`${new Date().toLocaleTimeString()} | INFO - ${primeMessage}`)
}

function updateColor() {
    if(colors_sent % 10 == 0) {
        // every 10th color.
        showInfo()
    }
    colors_sent++;
    let color = "";
    if(config.usePrimeColors) {
        if ( config.useRainbow ) {
            color = rainbowHex();
        } else {
            color = randomHex()
        }
    } else {
        color = nonPrimeColor()
    }
    if (client_ready) {
        console.log(`${new Date().toLocaleTimeString()} | ${color}`)
        client.privmsg(config.username, `/color ${color}`);
    }
}

// only do it every ammount of seconds
if (!config.onlyChangeColorOnMessageSent) {
    setInterval(updateColor, config.seconds * 1000);
}



console.log(`${new Date().toLocaleTimeString()} | THANKS - Thanks for using my colorchanger, inspired by turtoise's version.`)
console.log(`${new Date().toLocaleTimeString()} | CREDIT - This color changing script was made by QuinnDT and can be found at twitch.tv/quinndt in chat.`)
console.log(`${new Date().toLocaleTimeString()} | INFO - Connecting...`)
client.connect()
if (config.onlyChangeColorOnMessageSent) {

    const anonClient = new ircLib.ChatClient();

    anonClient.on("PRIVMSG", (msg) => {
        // whenever the anon client sees a message, it just checks if the sender is you,
        // then it will update the color if it is.
        if (msg.senderUsername == config.username) {
            console.log(`${new Date().toLocaleTimeString()} | INFO - [${msg.channelName}] ${msg.senderUsername}: ${msg.messageText}`)
            updateColor()
            
        }
    })
    
    anonClient.on("ready", () => {
        console.log(`${new Date().toLocaleTimeString()} | INFO - Anonymous client connected.`)
    })
    
    anonClient.on("JOIN", (msg) => {
        console.log(`${new Date().toLocaleTimeString()} | INFO - Anonymous client joined #${msg.channelName}.`)
    })

    // only join if were going to use them. 
    // because the anon client will just check every message if its you.
    anonClient.connect()
    anonClient.joinAll(config.channelsToCheckForMessagesSent);
}
