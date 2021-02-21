# twitch-chat-colorchanger
Changes your chat color on twitch.tv to random colors, every so often.

## installation
1. Make sure you have NodeJS installed, you can install it here: https://nodejs.org
2. Either clone the repository if you have git installed, or download the zip file of the code.
![Image showing download button](https://i.imgur.com/ztyR5Mb.png)
3. Run `npm i` in the command line to install dependencies.
4. Copy the `config.example.js` file to a file called `config.js`
5. Edit the contents of the config file to hold your information, there is instructions in the file.
5. Register a chat bot application on https://dev.twitch.tv (top right)
    - I think it might be TOS to not do this step. Not sure.
    - For the redirect url, use https://localhost/
    - ![Image showing application registration screen](https://i.imgur.com/yjnI23y.png )
6. Run `node .` in the command line to start the program.
