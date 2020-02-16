import {} from "dotenv/config";
import Telegraf from "telegraf";
import searchJobs from "./searchJobs";
import fetch from "node-fetch";

const express = require("express");

const app = express();

app.get("/_ah/start", (req, res) => {
  console.log("handle _ah/start");

  res.sendStatus(200);
});

const createMessageText = job => {
  return `
<strong>${job.title}</strong>
<em>${job.snippet}</em>`;
};

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.on("inline_query", async ctx => {
  const searchResults = await searchJobs(ctx.inlineQuery.query);
  const results =
    searchResults && searchResults.length
      ? searchResults.map((job, id) => ({
          id,
          type: "article",
          title: job.title,
          description: job.snippet,
          input_message_content: {
            message_text: createMessageText(job),
            parse_mode: "HTML"
          },
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Open url",
                  url: job.url
                }
              ]
            ]
          }
        }))
      : [];

  ctx.answerInlineQuery(results);
});
bot.launch();

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
