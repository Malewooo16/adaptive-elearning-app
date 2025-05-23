import prisma from "@/db/prisma";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import  {compare} from 'bcryptjs'

export default {
    providers: [
        Google({
         
        }),
        Credentials({
            id:"credentials",
            name:"credentials",
    
            credentials:{
               email:{label:"email", type:"text"},
               password:{label:"password", type:"text"}
            },
    
            async authorize(credentials){
            // console.log(credentials)
             if (!credentials?.email || !credentials?.password) {
               return null;
             }
    
             const existingUser = await prisma.user.findUnique({
               where:{
                   email:credentials.email as string
               }
             })
    
             if(!existingUser){
               throw new Error("User Does not Exist")
             }
             
             const passwordMatch = (credentials.password === existingUser.password);
             if(!passwordMatch){
               throw new Error ("Invalid Password")
             }
             return{
                 id:existingUser.id,
                 email:existingUser.email,
                 name:existingUser.name,
                 role:existingUser.role
             }
            }
    
            
       })
    
      ],
} satisfies NextAuthConfig