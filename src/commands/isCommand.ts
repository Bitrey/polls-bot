import { Message } from "discord.js";
import commands, { Command } from ".";
import { sendCommandsEmbed, sendSyntaxEmbed } from "./embeds";
import { findServer } from "../functions/findServer";
import Server from "../models/Server";

export const isCommand = async (args: string[], message: Message) => {
    try {
        let command: false | Command = false;
        for (const commandInner of commands) {
            for (const commandName of commandInner.names) {
                if (args[0] === commandName) {
                    command = commandInner;
                    break;
                }
            }
        }
        if (!command) return sendCommandsEmbed(message);

        // First argument is command name
        args.shift();

        // Check if all arguments have been provided
        if (args.length < command.expectedArguments) {
            message.channel.send("Please provide all the required arguments");
            return sendSyntaxEmbed(message, command);
        }

        // "Object is possibly null"... TypeScript!
        if (!message.guild) throw new Error(`${message.guild} null`);

        let server = await findServer(message.guild.id);

        // If server is not saved in the database, save it
        if (!server) {
            server = new Server({ guildId: message.guild.id, polls: [] });
            await server.save();
        }

        const executedCommand = await command.function(server, args, message);
        if (!executedCommand) {
            return sendSyntaxEmbed(message, command);
        } else return;
    } catch (err) {
        console.error(err);
        message.channel.send(err);
    }
};

export default isCommand;
