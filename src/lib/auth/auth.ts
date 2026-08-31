import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../db";
import { sendEmail } from "../email";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not set.");
}

export const auth = betterAuth({
  appName: "NextAdmin",
  baseURL: process.env.BETTER_AUTH_URL!,

  user: {
    additionalFields: {
      phoneNumber: {
        type: "number",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password - Bimbel Cermat",
        html: `<p>Click <a href="${url}">here</a> to reset your password. Link expires in 1 hour.</p>`,
        text: `Reset your password: ${url}`,
      });
    },
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password reset completed for ${user.email}`);
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  // plugins: [...authorizationPlugins],

  session: {
    // cookieCache: {
    //   enabled: true,
    //   maxAge: 60 * 5,
    //   strategy: "compact",
    // },
    deferSessionRefresh: true,
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,
  },

  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL!,
    process.env.BETTER_AUTH_URL!,
  ],
});
