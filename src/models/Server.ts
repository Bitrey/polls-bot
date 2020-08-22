import { Schema, Document, model } from "mongoose";
import { IPoll } from "./Poll";

export interface IServer extends Document {
    guildId: string;
    polls: IPoll["_id"][];
}

const ServerSchema = new Schema(
    {
        guildId: { type: String, required: true },
        polls: [{ type: Schema.Types.ObjectId, ref: "Poll" }]
    },
    { timestamps: true }
);

export default model<IServer>("Server", ServerSchema);
