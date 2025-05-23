"use client"
import { handleCredentialsLogin } from "@/actions/auth/login/credentialsLogin";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { redirect } from "next/navigation";
import { useState } from "react";

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

    try {
      // Replace with actual authentication logic
      await handleCredentialsLogin(formData);
      console.log("Login successful", formData);
    } catch (err) {
      setError("Invalid credentials");
      console.log("Login failed", err);
    } finally {
      setLoading(false);
      redirect(`/topics`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center bg-gradient-to-br from-blue-200 to-blue-700 relative">
      
    {/* Fixed height Fox Animation */}
    <DotLottieReact 
      src="/Foxr.lottie" 
      loop 
      autoplay 
      width={250}
      height={360}  // Fixing the height
      className="w-[400px] md:w-[600px] h-[360px] relative"  // Add margin-bottom for spacing
    />

    {/* Glassmorphic Login Card */}
    <div className="relative bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/40 mt-[-120px]">  {/* Adjusted top margin */}
      <h2 className="text-center text-3xl font-bold text-gray-900 drop-shadow-lg">
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5 mt-6">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  </div>
  );
}
