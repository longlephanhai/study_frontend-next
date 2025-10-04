import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import { sendRequest } from "./utils/api"
import { JWT } from "next-auth/jwt"


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
      // if (trigger === "signIn" && account?.provider !== "credentials") {
      //   const res = await sendRequest<IBackendRes<JWT>>({
      //     url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/social-media`,
      //     method: "POST",
      //     body: {
      //       type: account?.provider?.toLocaleUpperCase(),
      //       username: user.email
      //     },
      //   })
      //   if (res.data) {
      //     token.access_token = res.data?.access_token;
      //     token.refresh_token = res.data.refresh_token;
      //     token.user = res.data.user;
      //     token.access_expire = dayjs(new Date()).add(
      //       +(process.env.TOKEN_EXPIRE_NUMBER as string), (process.env.TOKEN_EXPIRE_UNIT as any)
      //     ).unix();
      //   }
      // }

      if (trigger === "signIn" && account?.provider === "credentials") {
        //@ts-ignore
        token.access_token = user.access_token;
        //@ts-ignore
        // token.refresh_token = user.refresh_token;
        //@ts-ignore
        token.user = user.user;
        //@ts-ignore
        // token.access_expire = dayjs(new Date()).add(
        //   +(process.env.TOKEN_EXPIRE_NUMBER as string), (process.env.TOKEN_EXPIRE_UNIT as any)

        // ).unix();

      }

      // const isTimeAfter = dayjs(dayjs(new Date())).isAfter(dayjs.unix((token?.access_expire as number ?? 0)));

      // if (isTimeAfter) {
      //   return refreshAccessToken(token)
      // }

      return token;
    },
    session({ session, token }) {
      //@ts-ignore
      session.user = token.user;
      //@ts-ignore
      session.access_token = token.access_token;
      return session
    },
  }
})