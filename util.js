// Imports
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
 * @param {(config: any) => void} ShowSomeInfo Function to show info. (??)
 */
const getClient = (config, ShowSomeInfo) => {
    let client = new DankTwitch.ChatClient(config)

    client.on("ready", () => {
        log("info", "Connected to chat.")
        ShowSomeInfo(config)
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
const setChannels = (arr) => {
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
 * @param {any} config The config.
 * @param {() => void} UpdateColorMethod A function that when called will update the color.
 * @returns {DankTwitch.ChatClient} The anon client.
 */
const getAnonClient = (config, UpdateColorMethod) => {
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
                setChannels(channels)
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



// Exporting
module.exports = {
    log,
    getClient,
    getChannels,
    setChannels,
    showInfo,
    randInt,
    getAnonClient,
}