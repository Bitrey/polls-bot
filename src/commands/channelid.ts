import { Message, EmbedFieldData } from "discord.js";
import Poll from "../models/Poll";
import { IServer } from "../models/Server";
import createEmbed from "./embeds";
import { generatePollId } from "../functions/generatePollId";

export const channelID = (
    server: IServer,
    args: string[],
    message: Message
): boolean => {
    if (!message.guild) {
        message.channel.send("You're not in a guild");
        return false;
    }

    const textChannels = message.guild.channels.cache.filter(
        e => e.type === "text"
    );

    const channelsField: EmbedFieldData[] = textChannels.map(e => ({
        name: e.name,
        value: e.id
    }));

    const successEmbed = createEmbed({
        title: "Channel IDs",
        description: "Here are all the channels with their respective IDs",
        color: "#11ed4b",
        fields: channelsField
    });

    message.channel.send(successEmbed);

    return true;
};
