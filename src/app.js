import tmi from 'tmi.js'
import { BLOCKED_WORDS, BOT_USERNAME, CHANNEL_NAME, OAUTH_TOKEN } from './constants';

console.log("app started")
console.log("***********")

const options = {
    options: { debug: true },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        // bot-name
        username: BOT_USERNAME, 
        // oauth:my-bot-token
        password: OAUTH_TOKEN
    },
    channels: 
    // my-channel
    [ CHANNEL_NAME ]
}

const client = new tmi.Client(options);

client.connect();
client.on('message', (channel, userState, message, self) => {
    // ignore echoed messages
    if(self) return;
    if (userState.username === BOT_USERNAME) return;

    // responding?
    if(message.toLowerCase() === '!hello') {
        client.say(channel, `@${userState.username}, heya!`);
    } 

    // check message
    checkTwitchChat (userState, message, channel)

});

function checkTwitchChat(userState, message, channel) {

    message = message.toLowerCase()
    
    let shouldSendMessage = false

    // check message
    shouldSendMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()))
    
    if (shouldSendMessage) {
        // tell user
        client.say(channel, `@${userState.username}, sorry! Your message was deleted.`)

        // delete message
        client.deletemessage(channel, userState.id)
    }
}