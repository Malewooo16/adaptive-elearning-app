"use server"


import { signIn } from "@/auth/authOptions";


export const handleCredentialsLogin = async (formData:any) => {     

    try{
        const {email, password} = formData;
        const response = await signIn("credentials", {email  , password, redirect:false});
        return response;
    }catch (error) { 
        console.log("Credentials Error" + error);
        return {error: "Invalid Credentials"}
    }
   
}