import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import { sendRequest } from "./utils/api"
import { JWT } from "next-auth/jwt"
import dayjs from "dayjs";

async function refreshAccessToken(token: JWT) {

  const res = await sendRequest<IBackendRes<JWT>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`,
    method: "POST",
    body: { refresh_token: token?.refresh_token }
  })

  if (res.data) {
    console.log(">>> check old token: ", token.access_token);
    console.log(">>> check new token: ", res.data?.access_token)

    return {
      ...token,
      access_token: res.data?.access_token ?? "",
      refresh_token: res.data?.refresh_token ?? "",
      access_expire: dayjs(new Date()).add(
        +(process.env.TOKEN_EXPIRE_NUMBER as string), (process.env.TOKEN_EXPIRE_UNIT as any)
      ).unix(),
      error: ""
    }
  } else {
    //failed to refresh token => do nothing
    return {
      ...token,
      error: "RefreshAccessTokenError", // This is used in the front-end, and if present, we can force a re-login, or similar
    }
  }

}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const response = await sendRequest<IBackendRes<JWT>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
          method: "POST",
          body: {
            email: credentials?.email,
            password: credentials?.password,
          },
        })

        if (response && response.data) {
          console.log("Login successful:", response.data)
          return response.data
        } else {
          throw new Error(response.message || "Login failed")
        }
      },
    }),
    GitHub
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger }) {
      if (trigger === "signIn" && account?.provider === "credentials") {
        //@ts-ignore
        token.access_token = user.access_token;
        //@ts-ignore
        token.refresh_token = user.refresh_token;
        //@ts-ignore
        token.user = user.user;
        //@ts-ignore
        token.access_expire = dayjs(new Date()).add(
          +(process.env.TOKEN_EXPIRE_NUMBER as string), (process.env.TOKEN_EXPIRE_UNIT as any)

        ).unix();

      }

      const isTimeAfter = dayjs(dayjs(new Date())).isAfter(dayjs.unix((token?.access_expire as number ?? 0)));

      if (isTimeAfter) {
        return refreshAccessToken(token)
      }

      return token;
    },
    session({ session, token }) {
      if (token) {
        //@ts-ignore
        session.user = token.user;
        session.refresh_token = token.refresh_token;
        session.access_token = token.access_token;
        session.access_expire = token.access_expire;
        session.error = token.error
      }
      return session
    },
  }
})