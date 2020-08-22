import { IServer } from "../models/Server";
import Poll from "../models/Poll";

export const generatePollId = (server: IServer): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            let pollId = (Math.floor(Math.random() * 900) + 100).toString();
            // If poll ID is already used for that server, generate a new one
            while (await Poll.exists({ pollId })) {
                pollId = (Math.floor(Math.random() * 900) + 100).toString();
            }
            resolve(pollId);
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
};
