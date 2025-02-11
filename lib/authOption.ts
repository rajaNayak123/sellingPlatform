import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs"
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if(!credentials?.email || !credentials?.password){
            throw new Error("Invalid credentials")
        }
        try {
            await connectToDatabase();
           const user = await User.findOne({email:credentials.email})

           if(!user){
            throw new Error("User not found in this email")
           }

          const validPassword = await bcrypt.compare(credentials.password, user.password);
        
          if(!validPassword){
            throw new Error("Password is incorrect")
          }

          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
          }
        } catch (error) {
            console.log("auth error",error);
            throw error;
        }
      },
    }),
  ],
  callbacks:{
    async jwt({token, user}){
      if(user){
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({session,token}){
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      
      return session;
    }
  },
  pages:{
    signIn:'/login',
    error:'/login',
  },
  session:{
    strategy:"jwt",
    maxAge: 30 * 24 * 60 * 60 
  },
  secret:process.env.NEXTAUT_SECRET
  
};
