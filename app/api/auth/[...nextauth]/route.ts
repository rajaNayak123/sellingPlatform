import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOption";

const handler = NextAuth(authOptions);

export {handler as POST, handler as GET}