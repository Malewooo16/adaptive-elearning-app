"use client"
import { handleCredentialsLogin } from "@/actions/auth/login/credentialsLogin";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {FcGoogle} from "react-icons/fc";
import { LogIn, Lock, Mail } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

   setLoading(true)
    const response = await handleCredentialsLogin(formData);
    if (response.error) {
      setLoading(false)
      setError(response.error);
    }else{
      redirect(`/topics`);
    }
  };

  return (
      <><header className="px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-orange-600"><Link href={`/`}>EduNex</Link></div>
   
    </header><div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-orange-600">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-2">Login to continue learning</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm text-center font-semibold">Error:{error}</div>}
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-orange-500" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.email}
                onChange={handleChange}
                required />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-orange-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.password}
                onChange={handleChange}
                required />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
             <span className="loading loading-spinner loading-lg"></span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Login </span>
              )}
            
            </button>
          </form>

          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-full bg-gray-300" />
            <span className="text-sm text-gray-400">OR</span>
            <span className="h-px w-full bg-gray-300" />
          </div>

          <button
            className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >
            <FcGoogle className="w-5 h-5 text-red-500" />
            Continue with Google
          </button>

          <p className="text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <a href="/register" className="text-orange-600 font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div></>
      
  );
}
