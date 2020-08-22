import {
    MessageEmbed,
    EmbedFieldData,
    ColorResolvable,
    Message
} from "discord.js";
import commands, { Command } from "..";

interface EmbedArgs {
    title: string;
    description: string;
    fields?: EmbedFieldData[];
    footer?: string;
    addTimestamp?: boolean;
    color?: ColorResolvable;
    thumbnail?: string;
}

export const createEmbed = (args: EmbedArgs): MessageEmbed => {
    const msg = new MessageEmbed()
        .setColor(args.color || "#0099ff")
        .setTitle(args.title)
        .setDescription(args.description);
    if (args.thumbnail) msg.setThumbnail(args.thumbnail || "");
    if (args.fields) msg.addFields(args.fields);
    if (args.addTimestamp) msg.setTimestamp();
    if (args.footer) msg.setFooter(args.footer);

    return msg;
};

export const sendSyntaxEmbed = (message: Message, command: Command) => {
    const msg = createEmbed({
        title: command.names[0] + ":  " + command.description,
        description: "Syntax: " + command.syntax,
        color: "#fcdf03"
    });
    message.channel.send(msg);
};

export const sendCommandsEmbed = (message: Message) => {
    const fields: EmbedFieldData[] = commands.map(e => ({
        name: e.names[0],
        value: e.description
    }));
    const msg = createEmbed({
        title: "Commands list",
        description: "List of all possible commands",
        color: "#458af7",
        fields: fields
    });
    message.channel.send(msg);
};

export default createEmbed;
