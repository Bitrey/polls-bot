import Server, { IServer } from "../models/Server";

export const findServer = (guildId: string): Promise<IServer | null> => {
    return new Promise(async (resolve, reject) => {
        try {
            const server = await Server.findOne({ guildId }).exec();
            resolve(server);
        } catch (err) {
            console.error(err);
            resolve(null);
        }
    });
};
