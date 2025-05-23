import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

console.log("Environment:", process.env);
console.log("AuthOptions:", authOptions);

export { handler as GET, handler as POST };
