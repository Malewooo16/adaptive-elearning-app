"use client";

import registerUser from "@/actions/auth/register";
import { sendVerificationEmail } from "@/actions/emailService/verifyUserEmail";
import {CheckCircle} from "lucide-react";
import Link from "next/link";
import {useState} from "react";
import {FcGoogle} from "react-icons/fc";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null); // Clear previous errors
  setSuccess(false); // Optional: reset previous success state

  try {
    const response = await registerUser(formData);
    if (response.success) {
      setSuccess(true);
    } else {
      setError(response.message || "Registration failed");
      console.error("Registration failed:", response.message);
    }
  } catch (err) {
    console.error("An error occurred during registration:", err);
    setError("An unexpected error occurred. Please try again.");
  } finally {
    setLoading(false);
  }
};





  const handleGoogleSignIn = () => {
    // Placeholder for Google auth logic
    console.log("Sign in with Google");
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Registration Successful!
          </h2>
            <p className="text-gray-600 mb-6">
            An email verification link has been sent to your email address. Please check your inbox and follow the instructions to verify your account.Once your email is verified, you can log in and start exploring EduNex!
            </p>
          
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-orange-600">
          <Link href={`/`}>EduNex</Link>
        </div>
      </header>
      <div className="flex items-center px-4">
        <h2 className="text-2xl font-bold text-orange-500 text-center mb-6 mx-4 p-4 w-1/2">
          Welcome to <span className="text-blue-500">EduNex</span> — a
          comprehensive e-learning platform designed to meet your unique needs
          and elevate your learning journey.
        </h2>

        <div className="bg-white rounded-2xl shadow-xl w-full mx-20 max-w-md p-8 -mt-6">
          <h2 className="text-2xl font-bold text-orange-500 text-center mb-6">
            Create your account
          </h2>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-lg mb-5 hover:bg-gray-100 transition"
          >
            <FcGoogle size={20} />
            <span className="text-sm font-medium text-gray-700">
              Sign in with Google
            </span>
          </button>

          <div className="relative text-center mb-5">
            <span className="bg-white px-2 text-gray-400 text-sm">
              or continue with email
            </span>
            <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200 -z-10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {error && (<div className="text-red-500 text-sm text-center"> <p>{error}</p></div>)}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-800 transition duration-300"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-orange-600 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
