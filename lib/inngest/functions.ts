import { sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";

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
