
import { Sparkles, BrainCircuit, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-orange-50 text-gray-800">
      <header className="px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-orange-600">EduNex</div>
        <nav className="space-x-4">
          <Link href="#features" className="text-gray-700 hover:text-orange-600 font-medium">
            Features
          </Link>
          <Link href="#about" className="text-gray-700 hover:text-orange-600 font-medium">
            About
          </Link>
          <Link href="/login">
            <button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-4 py-2">
              Login
            </button>
          </Link>
        </nav>
      </header>

      <main className="flex flex-col lg:flex-row items-center justify-between px-8 lg:px-20 py-20 gap-12">
        <div className="max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900 mb-6">
            Adaptive AI-powered Learning Platform
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Empower your learning journey with our adaptive e-learning platform. Backed by AI, EduNex personalizes your experience, ensuring you grow at your own pace.
          </p>
          <Link href="/register">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl text-lg flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        <div className="relative w-full max-w-lg">
          <div className="absolute top-0 left-0 bg-orange-100 w-72 h-72 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 bg-orange-200 w-72 h-72 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse"></div>
          <div className="relative z-10 p-6 bg-white rounded-2xl shadow-xl flex flex-col items-center gap-4">
            <BrainCircuit className="w-12 h-12 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-800 text-center">
              Smarter Paths to Success
            </h2>
            <p className="text-gray-600 text-center">
              Our AI adapts content dynamically based on your performance and behavior.
            </p>
          </div>
        </div>
      </main>

      <section id="features" className="bg-white py-20 px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Platform Highlights</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-orange-50 rounded-2xl shadow p-6 text-center">
            <Sparkles className="w-10 h-10 mx-auto text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Adaptive Learning</h3>
            <p className="text-gray-600">AI tailors content to your strengths and weaknesses.</p>
          </div>
          <div className="bg-orange-50 rounded-2xl shadow p-6 text-center">
            <BrainCircuit className="w-10 h-10 mx-auto text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Data-Driven Insights</h3>
            <p className="text-gray-600">Track your progress and get smart feedback on your learning path.</p>
          </div>
          <div className="bg-orange-50 rounded-2xl shadow p-6 text-center">
            <ArrowRight className="w-10 h-10 mx-auto text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Seamless Experience</h3>
            <p className="text-gray-600">Elegant UI with intuitive navigation for all learners.</p>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} EduNex. All rights reserved. <a target="_blank" href="https://icons8.com/icon/40811/fox">Fox</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
      </footer>
    </div>
  );
}
