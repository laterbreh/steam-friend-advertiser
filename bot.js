/*
 * Steam-Friend-Advertiser
 * Created by: Laterbreh
 * Description: This script was designed to easily send every user on your friends list a message. You DO NOT need to be logged out of the client.
 * Installation: npm install steam-user, npm install sleep
 */
var SteamUser = require('steam-user');
var client = new SteamUser();
var sleep = require('sleep');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('Username: ', function (accountname) {
    rl.question('Password: ', function (password) {
        rl.question('Message that you would like to send to your friends list: ', function (message) {
            doLogin(accountname, password, message);
            rl.close();
        });
    });
});
function doLogin(accountname, password, message) {
    client.logOn({
        "accountName": accountname,
        "password": password
    });
    client.on('loggedOn', function (details) {
        console.log("Logged into Steam as " + client.steamID.getSteam3RenderedID());
        //console.log(details);
        client.setPersona(SteamUser.Steam.EPersonaState.Online);
    });
    client.on('error', function (e) {
        console.log('ERROR: ' + e);
    });
    client.on('friendsList', function () {
        console.log('Number of friends to send a message to: ' + Object.keys(client.myFriends).length);
        var count = 0;
        for (var key in client.myFriends) {
            if (client.myFriends.hasOwnProperty(key)) {
                count++;
                //Comment out line 43 if you want to risk it... Current delay is 2 seconds between each message.
                sleep.sleep(2);
                console.log('Sending Message Number: ' + count);
                client.chatMessage(key, message);

            }
        }
    });
    client.on('friendMessage', function (steamID, message) {
        console.log("Friend message from " + steamID.getSteam3RenderedID() + ": " + message);
    });
}
