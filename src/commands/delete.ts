import { Message } from "discord.js";
import Poll from "../models/Poll";
import { IServer } from "../models/Server";
import createEmbed from "./embeds";

export const deletePoll = async (
    anyServer: any,
    args: string[],
    message: Message
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const server: IServer = anyServer;

            await server.populate("polls").execPopulate();

            const [pollId] = args;

            if (!(await Poll.exists({ pollId }))) {
                message.channel.send("No poll exists with ID " + pollId);
                return resolve(false);
            }

            await Poll.deleteOne({ pollId }).exec();
            // Array pull doesn't exist for some reasons, we have to use any type!!
            await anyServer.polls.pull({ pollId });
            await server.save();

            const successEmbed = createEmbed({
                title: `Success`,
                description: `Poll with ID ${pollId} successfully deleted`,
                color: "#f52a2a",
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
