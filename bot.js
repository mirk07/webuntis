import { Bot, webhookCallback } from "node-telegram-bot-api";

import dotenv from "dotenv";
dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN);

export default bot;
