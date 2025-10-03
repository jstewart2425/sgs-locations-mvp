import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyUser } from "@/lib/auth";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await verifyUser(credentials.email, credentials.password);
        if (!user) return null;
        return { id: user.id, email: user.email, name: user.name || "" };
      },
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});
export { handler as GET, handler as POST };
