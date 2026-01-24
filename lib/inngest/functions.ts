import { getNews } from "../actions/finnhub.actions";
import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { formatDateToday } from "../utils";
import { inngest } from "./client";
import {
  NEWS_SUMMARY_EMAIL_PROMPT,
  PERSONALIZED_WELCOME_EMAIL_PROMPT,
} from "./prompts";

interface UserForNewsEmail {
  id: string;
  email: string;
  name: string;
}

export const sendSignupEmail = inngest.createFunction(
  { id: "sign-up-email" },
  { event: "app/user.created" },
  async ({ event, step }) => {
    const userProfile = `
    -Country: ${event.data.country}
    -Investment Goals: ${event.data.investmentGoals}
    -Risk Tolerance: ${event.data.riskTolerance}
    
    `;
    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile,
    );
    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({
        model: "gemini-2.5-flash",
      }),
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    });
    //sending email
    await step.run("send-welcome-email", async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      const introText =
        (part && "text" in part ? part.text : null) ||
        "Thanks for Joining Stocks App. You now have the tools to track market and make smarted moves.";
      const { data: { email, name } = event } = event;
      //Email sending logic
      await sendWelcomeEmail({
        email,
        name,
        intro: introText,
      });
    });

    return { success: true, message: "Email sent successfully" };
  },
);

export const sendDailyNewsSummary = inngest.createFunction(
  { id: "daily-news-summary" },
  [{ event: "app/daily.news.summary" }, { cron: "0 12 * * *" }],
  async ({ step }) => {
    // 1. Get all users
    const users = await step.run("get-all-users", getAllUsersForNewsEmail);

    if (!users || users.length === 0) {
      return { success: false, message: "No users found for news email" };
    }

    // 2. Process each user
    const results = await step.run("prepare-news-per-user", async () => {
      const perUser: Array<{
        user: UserForNewsEmail;
        articles: MarketNewsArticle[];
      }> = [];

      // Note: In a real large-scale app, we might fan-out events here instead of a loop
      for (const user of users as UserForNewsEmail[]) {
        try {
          // A. Get Watchlist

          const symbols = await getWatchlistSymbolsByEmail(user.email);

          // B. Get Stocks News
          let articles = await getNews(symbols);
          articles = articles || [].slice(0, 6);

          if (!articles || articles.length === 0) {
            articles = await getNews([]);
            articles = articles || [].slice(0, 6);
          }
          perUser.push({ user, articles });
        } catch (err) {
          console.error(`Failed to process user ${user.email}`, err);
          perUser.push({
            user,
            articles: [],
          });
        }
      }
      return perUser;
    });
    // Summarise news via AI
    const userNewsSummary: { user: User; newsContent: string | null }[] = [];

    for (const { user, articles } of results) {
      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
          "{{newsData}}",
          JSON.stringify(articles),
        );
        const response = await step.ai.infer(`summarise-news-${user.email}`, {
          model: step.ai.models.gemini({
            model: "gemini-2.5-flash",
          }),
          body: {
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          },
        });
        const part = response.candidates?.[0]?.content?.parts?.[0];
        const newsContent = part && "text" in part ? part.text : null;
        userNewsSummary.push({ user, newsContent });
      } catch (error) {
        console.error(`Failed to summarise news for user ${user.email}`, error);
        userNewsSummary.push({ user, newsContent: null });
      }
    }
    //send email through nodemailer
    await step.run("send-news-email", async () => {
      await Promise.all(
        userNewsSummary.map(async ({ user, newsContent }) => {
          if (!newsContent) {
            return false;
          }
          await sendNewsSummaryEmail({
            email: user.email,
            name: user.name,
            date: formatDateToday,
            newsContent,
          });
        }),
      );
    });
    return { success: true, message: "News email sent successfully" };
  },
);
