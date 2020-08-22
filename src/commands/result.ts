import { Message, TextChannel } from "discord.js";
import Poll from "../models/Poll";
import { IServer } from "../models/Server";
import createEmbed from "./embeds";
import { getEmoji } from "../functions/getEmoji";

export const pollResults = async (
    server: IServer,
    args: string[],
    message: Message
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!message.guild) {
                message.channel.send("You're not in a guild");
                return resolve(false);
            }

            let [pollId, channelId] = args;

            if (!channelId) channelId = message.channel.id;

            const poll = await Poll.findOne({ pollId }).exec();

            if (!poll) {
                message.channel.send("No poll exists with ID " + pollId);
                return resolve(false);
            } else if (!poll.isEnded) {
                message.channel.send(
                    "Poll is still open, you might want to end it beforehand"
                );
                return resolve(false);
            } else if (!poll.messageId) {
                message.channel.send(
                    "Poll has never been sent, please send it to accept votes first"
                );
                return resolve(false);
            }

            const textChannels: any = message.guild.channels.cache.filter(
                e => e.type === "text"
            );

            const channel: TextChannel = textChannels.get(channelId);
            if (!channel) {
                message.channel.send("No channel found with given channel ID");
                return resolve(false);
            }

            const sortedResults = poll.answers.sort((a, b) =>
                a.votedBy.length > b.votedBy.length ? -1 : 1
            );

            const fields = sortedResults.map((e, i) => {
                const emoji = getEmoji(i);
                const len = e.votedBy.length;
                return {
                    name: `${emoji} ${e.answer}`,
                    // Add s for plural
                    value: `**${len}** vote${len - 1 ? "s" : ""}`
                };
            });

            const pollEmbed = createEmbed({
                title: "Results of poll: " + poll.question,
                description: `Here are the results!`,
                addTimestamp: true,
                color: "#11ed4b",
                fields: fields
            });

            await channel.send(pollEmbed);

            return resolve(true);
        } catch (err) {
            console.error(err);
            resolve(false);
        }
    });
};
