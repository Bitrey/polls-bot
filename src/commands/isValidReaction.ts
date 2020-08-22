import { MessageReaction, User, PartialUser } from "discord.js";
import Poll from "../models/Poll";
import { client } from "../config";
import { getAnswerIndex } from "../functions/getEmoji";

export const isValidReaction = async (
    reaction: MessageReaction,
    user: User | PartialUser,
    hasBeenAdded: boolean
) => {
    // When we receive a reaction we check if the reaction is partial or not
    if (reaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await reaction.fetch();
        } catch (error) {
            console.error(
                "Something went wrong when fetching the message: ",
                error
            );
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

    const messageId = reaction.message.id;

    const messageAuthorId = reaction.message.author.id;

    // The bot adds a reaction at the beginning - don't count that
    if (user.id === client.user?.id) return;

    // If the reaction is not for the bot, it obviously wasn't for a poll
    if (messageAuthorId !== client.user?.id) return;

    const poll = await Poll.findOne({ messageId }).exec();

    // If no poll found - the reaction wasn't for a poll
    if (!poll) return;

    const index = getAnswerIndex(reaction.emoji.toString());
    const userHasAlreadyVoted = poll.answers[index].votedBy.includes(user.id);

    // Don't record new votes if poll has ended
    if (poll.isEnded) {
        try {
            // Remove reaction if user hadn't voted
            if (hasBeenAdded && !userHasAlreadyVoted) {
                await reaction.users.remove(user.id);
            }
            // You can't re-add reactions :/
            // else {
            //     DOESN'T WORK
            //     await reaction.users.add(user);
            // }
        } catch (error) {
            console.log(error);
            console.error("Failed to remove reactions.");
        }
        return;
    }

    if (hasBeenAdded) {
        // User already voted
        if (userHasAlreadyVoted) return;

        poll.answers[index].votedBy.push(user.id);
    } else {
        // Remove vote
        // Pull type not in mongoose array type
        const votes: any = poll.answers[index].votedBy;
        votes.pull(user.id);
    }

    await poll.save();
};

export default isValidReaction;
