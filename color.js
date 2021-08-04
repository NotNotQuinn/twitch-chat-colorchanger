"use strict";
// Imports
const config = require("./config");
const util = require("./util")
const Color = require('color');

let channels = util.getChannels(config)

// Initilization
let rainbowColor = Color('hsl(0, 60%, 50%)');
rainbowColor = rainbowColor.rotate(config.rainbowStartHue);
const client = util.getClient({
    username: config.username,
    password: config.oauth
}, () => util.showInfo(config));
let colors_sent = 0;
const nextTransitionalColor = util.getTransitionColorGetter(config)

// 2021-07-20: QuinnDT: This is a mess.........
// This whole code is so bad.
// But it works eShrug

// 2021-07-24: QuinnDT: Much better, but still sorta a mess.
// Glad I made './util.js' tho, made it a lot easier.

function randomHex() {
    let out = "#";
    const hexLetters = "0123456789abcdef"

    for(i = 0;i < 6;i++) {
        // chooses one random letter 6 times
        out += hexLetters[util.randInt(hexLetters.length)]
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
    out += primeColors[util.randInt(primeColors.length)];

    return out;
}


function updateColor() {
    if(colors_sent % 10 == 0) {
        // every 10th color.
        util.showInfo(config)
    }
    colors_sent++;
    let color = "";
    if(config.usePrimeColors) {
        if ( config.useRainbow ) {
            if ((config.colorList?.length ?? 0) > 0) {
                color = nextTransitionalColor();
                if (!color) throw new Error(`got invalid value as a color: ${color}`)
            } else color = rainbowHex();
        } else {
            color = randomHex()
        }
    } else {
        color = nonPrimeColor()
    }
    if (client.connections.length > 0) {
        util.log('color', color)
        client.privmsg(config.username, `/color ${color}`);
    } else {
        util.log('color', 'Did not update color because client not connected.')
    }
}

// only do it every ammount of seconds
if (!config.onlyChangeColorOnMessageSent) {
    setInterval(updateColor, config.seconds * 1000);
}

util.log('THANKS', `Thanks for using my colorchanger, inspired by turtoise's version.`)
util.log('INFO', `Connecting...`)
client.connect()
if (config.onlyChangeColorOnMessageSent) {

    let anonClient = util.getAnonClient(client, config, channels, updateColor)

    // only join if were going to use them. 
    // because the anon client will just check every message if its you.
    anonClient.connect()
    anonClient.joinAll(channels);
}
