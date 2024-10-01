import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
  providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      
      async authorize(credentials:any) {
        console.log("first")
        const response = await fetch('https://bank-aait-web-group-1.onrender.com/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await response.json();

        if (data.success && data.data) {
          return data
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.accessToken = user.accessToken;
        // token.profileStatus = user.profileStatus;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      session.user.accessToken = token.accessToken;
    //   session.user.profileStatus = token.profileStatus;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',  
  },
};