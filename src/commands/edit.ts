import { Message } from "discord.js";
import Poll from "../models/Poll";
import { IServer } from "../models/Server";
import createEmbed from "./embeds";
import { getEmoji } from "../functions/getEmoji";

export const editPoll = async (
    server: IServer,
    args: string[],
    message: Message
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const [pollId] = args;
            const poll = await Poll.findOne({ pollId }).exec();

            if (!poll) {
                message.channel.send("Invalid poll ID");
                return resolve(false);
            } else if (poll.isEnded) {
                message.channel.send(
                    "Poll has already been ended, you might want to delete it instead"
                );
                return resolve(false);
            }

            // Remove poll ID from Q&A
            args.shift();

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

            // Create new poll object

            // const poll = new Poll({
            //     pollId: pollId,
            //     author: message.author.id,
            //     question: question,
            //     answers: answers.map(e => ({ answer: e, votedBy: [] })),
            //     expiryDate: null,
            //     isEnded: false,
            //     messageId: null
            // });
            poll.question = question;
            poll.answers = answers.map(e => ({ answer: e, votedBy: [] }));

            await poll.save();

            const fields = answers.map((e, i) => {
                const emoji = getEmoji(i);
                return {
                    name: `Answer ${emoji}`,
                    value: e
                };
            });

            const successEmbed = createEmbed({
                title: `Poll with ID ${poll.pollId} was edited`,
                description: `Question: ${poll.question}`,
                addTimestamp: true,
                color: "#11ed4b",
                fields: fields
            });
            await message.channel.send(successEmbed);

            return resolve(true);
        } catch (err) {
            console.error(err);
            resolve(false);
        }
    });
};
