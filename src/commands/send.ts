import { Message, TextChannel } from "discord.js";
import Poll from "../models/Poll";
import { IServer } from "../models/Server";
import createEmbed from "./embeds";
import { getEmoji } from "../functions/getEmoji";

export const sendPoll = async (
    server: IServer,
    args: string[],
    message: Message
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let [pollId, channelId] = args;

            if (!channelId) channelId = message.channel.id;

            const poll = await Poll.findOne({ pollId }).exec();

            if (!poll) {
                message.channel.send("No poll exists with ID " + pollId);
                return resolve(false);
            } else if (poll.isEnded) {
                message.channel.send(
                    "Poll has already been ended, you might want to delete it instead"
                );
                return resolve(false);
            }
            // DEBUG: for debugging, don't consider if it's already been sent
            else if (poll.messageId) {
                message.channel.send(
                    "Poll has already been sent, you might want to delete it and create a new one instead"
                );
                return resolve(false);
            }

            if (!message.guild) {
                message.channel.send("You're not in a guild");
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

            const fields = poll.answers.map((e, i) => {
                const emoji = getEmoji(i);
                return {
                    name: `${emoji} = ${e.answer}`,
                    value: `React ${emoji} to vote "${e.answer}"`
                };
            });

            const pollEmbed = createEmbed({
                title: "Poll: " + poll.question,
                description: `You can reply by reacting below!`,
                addTimestamp: true,
                color: "#11ed4b",
                fields: fields
            });
            const sentMessage = await channel.send(pollEmbed);

            // Set message ID and channel ID to poll object
            poll.channelId = channel.id;
            poll.messageId = sentMessage.id;
            await poll.save();

            for (const [i] of poll.answers.entries()) {
                const emoji = getEmoji(i);
                // Find emoji
                await sentMessage.react(emoji || "❌");
            }

            if (channel.id !== message.channel.id) {
                await message.channel.send(
                    `Poll ${pollId} sent to text channel "${channel.name}"!`
                );
            }

            return resolve(true);
        } catch (err) {
            console.error(err);
            resolve(false);
        }
    });
};
