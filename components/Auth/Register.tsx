"use client";

import {useState} from "react";
import {FcGoogle} from "react-icons/fc";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // Hook up your registration logic here
  };

  const handleGoogleSignIn = () => {
    // Placeholder for Google auth logic
    console.log("Sign in with Google");
  };

  return (
    <div className="flex items-center bg-gradient-to-br from-blue-900 to-blue-700 px-4 py-12">
      <h2 className="text-2xl font-bold text-white  text-center mb-6 mx-4 p-4 w-1/2">
        Welcome to <span className="text-orange-500">Foxxie Learn</span> — a
        comprehensive e-learning platform designed to meet your unique needs and
        elevate your learning journey.
      </h2>

      <div className="bg-white rounded-2xl shadow-xl w-full mx-20 max-w-md p-8">
        <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
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
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white font-semibold py-2 rounded-lg hover:bg-blue-800 transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
