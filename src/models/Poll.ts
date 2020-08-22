import { Schema, Document, model } from "mongoose";

export interface IPoll extends Document {
    pollId: string;
    author: string;
    question: string;
    answers: { answer: string; votedBy: string[] }[];
    expiryDate: Date | null;
    isEnded: boolean;
    channelId: string | null;
    messageId: string | null;
}

const PollSchema = new Schema(
    {
        pollId: { type: String, required: true },
        author: { type: String, required: true },
        question: {
            type: String,
            minlength: 1,
            maxlength: 300,
            required: true
        },
        answers: [
            {
                answer: {
                    type: String,
                    minlength: 1,
                    maxlength: 100
                },
                // Discord IDs of those who voted this option
                votedBy: [{ type: String }]
            }
        ],
        expiryDate: { type: Date, default: null },
        isEnded: { type: Boolean, default: false },
        channelId: { type: String, default: null },
        messageId: { type: String, default: null }
    },
    { timestamps: true }
);

export default model<IPoll>("Poll", PollSchema);
