// configuration

// EDITING THIS FILE DOES NOTHING, 
// copy this file to a new file called "config.js"
// and then the changes you make there will take effect.

module.exports = {

    // this is your username, it must be in lowercase
    username: "example_user",

    // this is an oauth token to login to chat, you can get one here: https://twitchapps.com/tmi/ (you dont need the "oauth:" part)
    oauth: "xxxxxxxxxxxxxxxxxxxxxx",

    // this is how often the script will send a new color, you have to keep this in twitch ratelimits. 
    // See https://dev.twitch.tv/docs/irc/guide#command--message-limits for more information
    // just dont set it super low basicly, 10 seconds is as low as I would go.
    // just keep in mind that if you plan on spamming, you can only spam up to 20 messages per 30 seconds without mod/vip
    // and this will be part of that. (if you go over you wont be able to send any messages for about 30 mins)
    seconds: 15,

    // change to true to have ANY color (needs twitch prime or turbo)
    usePrimeColors: false,

    // This will only work if hasPrime is true
    // it will go through all colors in the rainbow, in order.
    useRainbow: false,

    // this is by how much the hue will change every color
    // negative numbers will go through the rainbow backwords.
    // at this speed, it will be very slow, almost unnoticable. 
    // but over a few mins it will look cool.
    rainbowSpeed: 1,

    // This is for if you want to start the rainbow in the middle or something. 
    // it will increace the hue by this ammount before the first color 
    rainbowStartHue: 0,

}
