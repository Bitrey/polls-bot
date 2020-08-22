import { PREFIX } from "./options.json";
import { client, BOT_TOKEN } from "./config";

import isCommand from "./commands/isCommand";
import isValidReaction from "./commands/isValidReaction";

client.on("message", message => {
    if (
        !message.content.startsWith(PREFIX) ||
        message.author.bot ||
        !message.guild
    )
        return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = (<string>args.shift()).toLowerCase();

    if (command === "poll") isCommand(args, message);
    else if (command === "polls") isCommand(["list"], message);
});

client.on("messageReactionAdd", async (reaction, user) => {
    isValidReaction(reaction, user, true);
});

client.on("messageReactionRemove", async (reaction, user) => {
    isValidReaction(reaction, user, false);
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(BOT_TOKEN);
