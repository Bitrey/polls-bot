import Poll, { IPoll } from "../models/Poll";
import { Message, EmbedFieldData } from "discord.js";
import { IServer } from "../models/Server";
import createEmbed from "./embeds";

export const listPolls = async (
    server: IServer,
    args: string[],
    message: Message
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            await server.populate("polls").execPopulate();

            const polls: IPoll[] = server.polls;

            const pollsFields: EmbedFieldData[] =
                polls.length > 0
                    ? polls.map(e => ({
                          name:
                              (e.messageId && !e.isEnded
                                  ? "[SENT] "
                                  : ""
                              ).toString() +
                              (e.isEnded ? "[ENDED] " : "").toString() +
                              e.pollId,
                          value: e.question
                      }))
                    : [{ name: "Well", value: "There are no polls here!" }];

            const listEmbed = createEmbed({
                title: "Polls list",
                description: "Here are all the polls saved on this server",
                addTimestamp: true,
                color: "#11ed4b",
                fields: pollsFields
            });
            await message.channel.send(listEmbed);

            return resolve(true);
        } catch (err) {
            console.error(err);
            resolve(false);
        }
    });
};
