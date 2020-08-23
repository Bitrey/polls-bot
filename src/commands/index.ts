import { createPoll } from "./create";
import { PREFIX } from "../options.json";
import { Message } from "discord.js";
import Server, { IServer } from "../models/Server";
import { listPolls } from "./list";
import { endPoll } from "./end";
import { deletePoll } from "./delete";
import { editPoll } from "./edit";
import { channelID } from "./channelid";
import { sendPoll } from "./send";
import { pollResults } from "./result";

export interface Command {
    names: string[];
    description: string;
    syntax: string;
    expectedArguments: number;
    function(
        server: IServer,
        args: string[],
        message: Message
    ): Promise<boolean> | boolean;
}

export const commands: Command[] = [
    {
        names: ["list", "all"],
        description: "List all polls on this server",
        syntax: PREFIX + "poll list",
        expectedArguments: 0,
        function: listPolls
    },
    {
        names: ["create", "new", "add"],
        description: "Create a new poll",
        syntax:
            PREFIX +
            "poll create <question> ANSWER <answer1> ANSWER <answer2>...",
        expectedArguments: 5,
        function: createPoll
    },
    {
        names: ["edit", "modify"],
        description: "Edit an existing poll",
        syntax:
            PREFIX +
            "poll edit <poll id> <new question> ANSWER <answer1> ANSWER <answer2>...",
        expectedArguments: 6,
        function: editPoll
    },
    {
        names: ["end", "stop", "close"],
        description: "End a poll (stop accepting answers)",
        syntax: PREFIX + "poll end <poll id>",
        expectedArguments: 1,
        function: endPoll
    },
    {
        names: ["delete"],
        description: "Delete an existing poll",
        syntax: PREFIX + "poll delete <poll id>",
        expectedArguments: 1,
        function: deletePoll
    },
    {
        names: ["send", "vote"],
        description:
            "Send poll to specific channel for voting" +
            `\nTo list channel IDs, type "${PREFIX}poll channelid"`,
        syntax: PREFIX + "poll send <poll id> <channel id>",
        expectedArguments: 1,
        function: sendPoll
    },
    {
        names: ["channelid", "channelsid", "channelids", "channeldsids"],
        description: "List all channels with their IDs",
        syntax: PREFIX + "poll channelid",
        expectedArguments: 0,
        function: channelID
    },
    {
        names: ["result", "results"],
        description: "Send the results of a poll",
        syntax: PREFIX + "poll result <poll id> <channel id>",
        expectedArguments: 1,
        function: pollResults
    }
];

export default commands;
