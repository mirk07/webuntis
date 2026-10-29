// const { WebUntis } = require("webuntis");
// const WEB_HOOK_URL = "https://localhost:3000/telegram-bot-webhook";

import dotenv from "dotenv";
dotenv.config();

// const chromeUserAgent =
//   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// const bot = new TelegramBot(process.env.BOT_TOKEN, {
//   webhook: { port: 88 },
// });

// const activeSessions = new Map();
// const canceledLessons = new Set();

// const initWebHook = async () => {
//   const webhookinf = await bot.getWebHookInfo();
//   if (webhookinf !== WEB_HOOK_URL) {
//     await bot.setWebHook(WEB_HOOK_URL, {
//       max_connections: 100,
//     });
//   }
// };

// initWebHook();

// bot.on("message", async (msg) => {
//   if (msg.text.toLowerCase() === "/start") {
//     bot.sendMessage(
//       chatId,
//       "Welcome! Enter your school details exactly in this format:\n\n" +
//         "**School Name**, **Username**, **Password**, **School Domain**",
//     );
//   }

//   const loginData = msg.text.split(",").map((item) => item.trim());
//   if (loginData.length < 4) {
//     bot.sendMessage(chatId, "You haven't entered your full login information");
//   } else {
//     const [school, username, password, schooldomain] = loginData;
//     const chatId = msg.chat.id;
//     if (activeSessions.has(chatId)) {
//       clearInterval(activeSessions.get(chatId));
//     }
//     bot.sendMessage(chatId, "Attempting to log in!");
//     const untis = new WebUntis(
//       school,
//       username,
//       password,
//       schooldomain,
//       chromeUserAgent,
//     );
//     logInAcc(untis, chatId);
//   }
// });



// async function fetchMyTimetable(untis, chatId) {
//   try {
//     const day = new Date();
//     if (day.getDay() === 6) day.setDate(day.getDate() + 2);
//     else if (day.getDay() === 0) day.setDate(day.getDate() + 1);

//     const timetable = await untis.getOwnTimetableForWeek(day);
//     if (!timetable || timetable.length === 0) return;

//     for (const lesson of timetable) {
//       if (
//         lesson.cellState !== "CANCEL" &&
//         lesson.cellState !== "SUBSTITUTION"
//       ) {
//         continue;
//       } else {
//         // const subject =
//         //   lesson.su && lesson.su[0] ? lesson.su[0].longname : "Unknown subject";
//         const lessonID = `${lesson.date}-${lesson.startTime}-${lesson.endTime}`;
//         if (!canceledLessons.has(lessonID)) {
//           canceledLessons.add(lessonID);
//           console.log("NEW ENTFALL", lesson);

//           await bot.sendMessage(
//             chatId,
//             `OMG THERE IS A NEW ENTFALL
//              \n${lesson.studentGroup ? lesson.studentGroup : lesson.lessonText}
//              \nDate:${lesson.date}`,
//           );
//         }
//       }
//     }
//   } catch (e) {
//     console.error(e);
//   }
// }

// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));

import express from "express";
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN;
import bot from "./bot.js";

const app = express();

app.use(express.json());

if (!WEBHOOK_TOKEN) {
  throw new Error("Missing Telegram env vars");
}

app.get("/", (req, res) => res.send("jo"));
app.post("/webhook", async (req, res) => {
  if (req.get("X-Telegram-Bot-Api-Secret-Token") !== WEBHOOK_TOKEN) {
    console.log("No webhook token");
    return res.sendStatus(401);
  }

  res.sendStatus(200);

  try {
    const update = req.body;
    if (!update.message) return;
    console.log(update);

    const chatId = update.message.chat.id;
    const text = update.message.text || "";

    if (text === "/start") {
      await sendMessage(chatId, "Darova! Dai svoi dannie");
    } else if (text === "/help") {
      await sendMessage(
        chatId,
        "Available commands:\n/start - Start the bot\n/help - Show help",
      );
    } else {
      const loginData = text.split(",").map((i) => i.trim());
      if (loginData.length < 4) {
        await sendMessage(
          chatId,
          "You haven't entered your full login information",
        );
      } else {
        const [school, username, password, schooldomain] = loginData;
        await sendMessage(
          chatId,
          "Login information received. WebUntis authentication is not implemented yet.",
        );
      }
    }
  } catch (error) {
    console.error("Update processing failed:" + error.message);
  }
});

async function sendMessage(chatId, text) {
  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    },
  );
  if (!response.ok) {
    throw new Error(`Telegram API returned ${response.status}`);
  }
}

async function logInAcc(untis) {  
  try {
    await untis.login();
    await sendMessage(chatId, "Login succeed!");

    await fetchMyTimetable(untis, chatId);

    return {success: true, untis, chatId}
  } catch (e) {
    console.error(e);
    await sendMessage(chatId, "Login failed :(((");
  }
}

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
