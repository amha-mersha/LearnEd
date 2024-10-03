import CredentialsProvider from "next-auth/providers/credentials";

interface credType{
  email: string,
  password: string
}

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials:any) {
        console.log("first");
        const response = await fetch( "http://localhost:8080/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        );

        const data = await response.json();

        console.log(data);
        if (data) {
          return {
            id: data.token,
            accessToken: data.token,
            role: data.role
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.accessToken = user.accessToken;
        // token.profileStatus = user.profileStatus;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.accessToken = token.accessToken;
      // session.user.profileStatus = token.profileStatus;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET
};
