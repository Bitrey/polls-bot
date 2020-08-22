import { Message } from "discord.js";
import Poll from "../models/Poll";
import { IServer } from "../models/Server";
import createEmbed from "./embeds";
import { generatePollId } from "../functions/generatePollId";
import { PREFIX } from "../options.json";
import { getEmoji } from "../functions/getEmoji";

import mongoose from "mongoose";

export const createPoll = async (
    server: IServer,
    args: string[],
    message: Message
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const answers = args
                .join(" ")
                .split("ANSWER")
                .map(str => str.trim());
            const question = answers[0];
            answers.shift();

            if (answers.length < 2 || answers.length > 6) {
                message.channel.send("Answers must be between 2 and 6");
                return resolve(false);
            }

            const pollId = await generatePollId(server);

            // Create new poll object
            const poll = new Poll({
                pollId: pollId,
                author: message.author.id,
                question: question,
                answers: answers.map(e => ({ answer: e, votedBy: [] })),
                expiryDate: null,
                isEnded: false,
                channelId: null,
                messageId: null
            });

            server.polls.push(poll);
            try {
                await poll.save();
                await server.save();
            } catch (err) {
                message.channel.send("Error while saving: " + err);
                return resolve(false);
            }

            const fields = answers.map((e, i) => {
                const emoji = getEmoji(i);
                return {
                    name: `Answer ${emoji}`,
                    value: e
                };
            });

            const successEmbed = createEmbed({
                title: "New poll created with ID " + poll.pollId,
                description:
                    `Question: ${poll.question}` +
                    `\nSend it to accept votes with "**${PREFIX}poll send ${poll.pollId} <channelid>**"` +
                    `\nTo view all channel IDs, type "**poll channelid**"`,
                addTimestamp: true,
                color: "#11ed4b",
                fields: fields
            });
            await message.channel.send(successEmbed);

            return resolve(true);
        } catch (err) {
            if (err instanceof mongoose.Error.ValidatorError) {
                message.channel.send(err.message);
            } else {
                console.error(err);
            }
            resolve(false);
        }
    });
};
