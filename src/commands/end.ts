import { Message } from "discord.js";
import Poll from "../models/Poll";
import createEmbed from "./embeds";
import { PREFIX } from "../options.json";

export const endPoll = async (
    server: any,
    args: string[],
    message: Message
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const [pollId] = args;

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

            await Poll.updateOne(
                { pollId },
                { isEnded: true, expiryDate: new Date(Date.now()) }
            ).exec();

            const successEmbed = createEmbed({
                title: `Success`,
                description:
                    `Poll with ID ${pollId} successfully ended` +
                    `\nYou may send the results with "${PREFIX}poll result ${pollId}"`,
                color: "#11ed4b",
                addTimestamp: true
            });
            await message.channel.send(successEmbed);

            return resolve(true);
        } catch (err) {
            console.error(err);
            resolve(false);
        }
    });
};
