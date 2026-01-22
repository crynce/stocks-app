"use server";

import { headers } from "next/headers";
import { auth } from "../better-auth/auth";
import { inngest } from "../inngest/client";

export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  riskTolerance,
  investmentGoals,
  preferredIndustry,
  country,
}: SignUpFormData) => {
  try {
    //make call to better auth that will handle user creation,password hashing and session handling
    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName },
    });
    console.log(response, "response");
    //if successfull we want to trigger inngest background processing
    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
      console.log("Ran");
    }
    return { success: true, message: response };
  } catch (error) {
    console.log("Signup Failed", error);
    return { success: false, message: "Signup failed" };
  }
};
export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  try {
    //make call to better auth that will handle user creation,password hashing and session handling
    const response = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
    console.log(response, "response");
    //if successfull we want to trigger inngest background processing

    return { success: true, data: response };
  } catch (error) {
    console.log("Sign in Failed", error);
    return { success: false, error: "Sign in failed" };
  }
};
export const signOut = async () => {
  try {
    const headersVal = await headers();

    // Log headers to debug
    console.log("Headers received:", Object.fromEntries(headersVal.entries()));
    console.log("Cookie header:", headersVal.get("cookie"));
    await auth.api.signOut({
      headers: headersVal,
    });
    return { success: true, message: "User signed out successfully" };
  } catch (error) {
    console.log("Sign out failed", error);
    return { success: false, message: "Sign out failed" };
  }
};
