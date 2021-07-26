// Imports
const Color = require("color");
const DankTwitch = require("dank-twitch-irc");
const fs = require("fs");


// Util functions
/**
 * Logs things.
 * @param {string} level The level to show on screen
 * @param {any} thing Thing to log
 */
const log = (level, thing) => {
    console.log(`${new Date().toLocaleTimeString()} | ${level.toUpperCase()} -`, thing)
}

/**
 * Gets twitch client.
 * @param {object} config Config to pass to client.
 * @param {() => void} ShowSomeInfo Function to show info. (??)
 */
const getClient = (config, ShowSomeInfo) => {
    let client = new DankTwitch.ChatClient(config)

    client.on("ready", () => {
        log("info", "Connected to chat.")
        ShowSomeInfo()
    })
    return client
}

/**
 * Get channels from the file.
 * @param {any} config The config.
 * @returns {Array<string>} channels
 */
const getChannels = (config) => {
    return fs.readFileSync("channels.txt")
        .toString()
        .split(/\r?\n/i)
        .map(i => i.toLowerCase())
        .filter(Boolean)
        .filter(i => !i.startsWith("#"))
        .concat(config.username)
}

/**
 * Writes to the channels file attempting to keep newlines and comments.
 * @param {Array<string>} arr
 */
const setChannels = (arr, config) => {
    let lines = fs.readFileSync("channels.txt").toString().split(/\r?\n/i).filter(i => {
        if (i.startsWith("#")) return true;
        if (i === "") return true;
        return false;
    })

    // Always 1 empty line at the end.
    if (lines[lines.length-1] != "") lines.push("")
    lines = lines.concat(arr)
    fs.writeFileSync("channels.txt", lines.filter(i => i !== config.username).join('\r\n'))
}

/**
 * Shows info.
 * @param {any} config The config
 */
const showInfo = (config) => {
    let primeMessage = "Prime colors are off, if you would like to have more colors, turn it on. (Requires Prime/Turbo)"
    if(config.usePrimeColors) {
        primeMessage = "Prime colors are on. If its not doing anything, try turning them off."
    }
    if(config.useRainbow) {
        let rainbowMessage = `Rainbow is on. Speed: ${config.rainbowSpeed}`;
        if (!config.usePrimeColors) {
            rainbowMessage = "Rainbow is on, but prime colors are off. Using random default color."
        }
        log(`info`, rainbowMessage)
    }
    log('info', `All commands are only sent to YOUR chat (#${config.username})`)
    log('info', primeMessage)
}


/**
 * Generate a random number.
 */
const randInt = (limit) => {
    return Math.floor(Math.random() * Math.floor(limit));
}

/**
 * Gets the anon client
 * @param {DankTwitch.ChatClient} client The non-anon client.
 * @param {any} config The config.
 * @param {Array<string>} channels The list of channels.
 * @param {() => void} UpdateColorMethod A function that when called will update the color.
 * @returns {DankTwitch.ChatClient} The anon client.
 */
const getAnonClient = (client, config, channels, UpdateColorMethod) => {
    let useColor = true;

    const anonClient = new DankTwitch.ChatClient();

    anonClient.on("PRIVMSG", (msg) => {
        
        // whenever the anon client sees a message, it just checks if the sender is you,
        // then it will update the color if it is.
        if(msg.messageText == "toggleColor" && msg.senderUsername == config.username){
            if(useColor){
                useColor = false;
                client.privmsg(config.username, `Color is now off Kappa`)
                log('info', "Color is now off")
            }else{
                useColor = true;
                client.privmsg(config.username, `Color is now on KappaPride`)
                log('info', "Color is now on")
            }
            
        }
        
        if (msg.messageText.startsWith("addColor") && msg.senderUsername == config.username.toLowerCase()) {
            let channel = msg.messageText.split(" ")[1].toLowerCase()
            if (channels.indexOf(channel) == -1) {
                anonClient.join(channel);
                channels.push(channel)
                setChannels(channels, config)
                client.privmsg(config.username, "channel added")
            } else {
                client.privmsg(config.username, "Channel already on the list")
            }
        };
        if (msg.senderUsername == config.username && useColor == true) {
            log('INFO', `[${msg.channelName}] ${msg.senderUsername}: ${msg.messageText}`)
            UpdateColorMethod()
        }
    })
    
    anonClient.on("ready", () => {
        log('INFO', `Anonymous client connected.`)
    })
    
    anonClient.on("JOIN", (msg) => {
        log('INFO', `Anonymous client joined #${msg.channelName}.`)
    })

    return anonClient
}

/**
 * Get a transition function that will return a new transition between colors using HSL.
 *
 * The transition will not include the ending color, but will include the starting color.
 * @param {string} startColor The starting color
 * @param {string} endColor The finishing color
 * @returns {() => string|null} Transition function.
 */
const getTransitioner = (startColor, endColor, speedMultiplier) => {
    let start = Color(startColor).hsl();
    let current = Color(startColor).hsl();
    let end = Color(endColor).hsl();

    // Figure out how far we need to go for each.
    let Hdistance = end.hue() - start.hue()
    let Sdistance = end.saturationl() - start.saturationl()
    let Ldistance = end.lightness() - start.lightness()

    // This ensures that the speed will move the one that has the largest distance
    // one point at a time, and the others less than that.
    let numSteps = Math.ceil(Math.max(
        Math.abs(Hdistance),
        Math.abs(Sdistance),
        Math.abs(Ldistance)
    ));

    // The speed for the largest distance will be close to but smaller than 1
    // The others will be smaller than 1
    let Hspeed = Hdistance/numSteps
    let Sspeed = Sdistance/numSteps
    let Lspeed = Ldistance/numSteps

    let done = false;
    return () => {
        if (done || current.hex() == end.hex()) {
            done = true
            return null
        }

        let hex = current.hex()

        current = Color([
            current.hue() + Hspeed * speedMultiplier,
            current.saturationl() + Sspeed * speedMultiplier,
            current.lightness() + Lspeed * speedMultiplier
        ], 'hsl')

        // check here to see if we have essentially 'skipped over' the target color.
        // If we have, we are finished.
        if ((() => {
            if (Hspeed <= 0 ) {
                // Hue speed is negative, going downwards.
                if (current.hue() < end.hue()) return true;
            } else {
                if (current.hue() > end.hue()) return true;
            }
            if (Sspeed <= 0 ) {
                // Saturation speed is negative, going downwards.
                if (current.saturationl() < end.saturationl()) return true;
            } else {
                if (current.saturationl() > end.saturationl()) return true;
            }
            if (Lspeed <= 0 ) {
                // Saturation speed is negative, going downwards.
                if (current.lightness() < end.lightness()) return true;
            } else {
                if (current.lightness() > end.lightness()) return true;
            }
            return false
        })()) {
            console.log("Color overshot!")
            done = true
        }

        return hex
    }
}


/**
 * Gets a function that will transition the colours 
 * @param {object} config The config.
 * @returns {() => string|null} The transition color getter.
 */
const getTransitionColorGetter = (config) => {
    // If there is 0 or 1 colors, always return the only color or null
    if (Array.isArray(config.colorList) && config.colorList.length < 2) {
        const item =
            config.colorList[0]
                ? Color(config.colorList[0]).hex()
                : null
        return () => item
    }

    /** @type {Array<string>} */
    let colors = config.colorList;
    /** The index we are transitioning to. */
    let target = 1;
    /** The index we are transitioning from. */
    let last = 0;
    /** @type {() => string|null} */
    let nextColor = getTransitioner(colors[0], colors[1], config.rainbowSpeed);
    return () => {
        let color = nextColor()
        if (!color) {
            // We have just reached the target, increament or loop over.
            last = target;
            if (++target >= colors.length) {
                target = 0;
            };
            // Get the next transition and return the first item in it.
            nextColor = getTransitioner(colors[last], colors[target], config.rainbowSpeed);

            color = nextColor()
        }
        return color;
    }
}


// Exporting
module.exports = {
    getAnonClient,
    getChannels,
    getClient,
    getTransitionColorGetter,
    getTransitioner,
    log,
    setChannels,
    showInfo,
    randInt,
}