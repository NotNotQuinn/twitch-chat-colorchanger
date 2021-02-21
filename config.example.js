// configuration

// EDITING THIS FILE DOES NOTHING, 
// copy this file to a new file called "config.js"
// and then the changes you make there will take effect.

module.exports = {
    // change to true to have ANY color (needs twitch prime or turbo)
    hasPrime: true,
    // this is your username, it must be in lowercase
    username: "example_user",
    // this is an oauth token to login to chat, you can get one here: https://twitchapps.com/tmi/ (you dont need the "oauth:" part)
    oauth: "xxxxxxxxxxxxxxxxxxxxxx",
    // this is how often the script will send a new color, you have to keep this in twitch ratelimits. 
    // See https://dev.twitch.tv/docs/irc/guide#command--message-limits for more information
    seconds: 15
    // just dont set it super low basicly, 5 seconds is as low as I would go.
    // just keep in mind that if you plan on spamming, you can only spam up to 20 messages per 30 seconds without mod/vip
    // and this will be part of that. (if you go over you wont be able to send any messages for about 30 mins)
}
