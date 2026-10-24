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

// async function logInAcc(untis) {
//   try {
//     await untis.login();
//     await bot.sendMessage(chatId, "Login succeed!");

//     await fetchMyTimetable(untis, chatId);
//     const intervalId = setInterval(() => fetchMyTimetable(untis), 30000);

//     activeSessions.set(chatId, intervalId);
//   } catch (e) {
//     console.error(e);
//     await bot.sendMessage(chatId, "Login failed :(((");
//   }
// }

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
import bot from "./bot.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("jo"));
app.post("/webhook", (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
