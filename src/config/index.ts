// Discord
import { Client } from "discord.js";
export const client = new Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"]
});

import dotenv from "dotenv";
dotenv.config();
// Check env
export const { BOT_TOKEN, MONGODB_URI } = process.env;
if (typeof BOT_TOKEN !== "string") throw new Error("Token is not a string");
if (typeof MONGODB_URI !== "string")
    throw new Error("MongoDB URI is not a string");

import mongoose from "mongoose";
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

import { PREFIX } from "../options.json";

if (typeof PREFIX !== "string")
    throw new Error("Please add PREFIX to options.json");
