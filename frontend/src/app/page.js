import React from "react";
import Link from "next/link";
import Navbar from "./components/navbar";

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to MarketMind AI
        </h1>
        <p className="text-gray-600 mb-6">
          Let's personalize your marketing assistant
        </p>

        <form className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              What's your business name?
            </h2>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="E.g. Acme Corp"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              What industry are you in?
            </h2>
            <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select your industry</option>
              <option value="ecommerce">E-commerce</option>
              <option value="saas">SaaS</option>
              <option value="retail">Retail</option>
              <option value="agency">Marketing Agency</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
            </select>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              Your primary marketing goal?
            </h2>
            <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select a goal</option>
              <option value="leads">Generate more leads</option>
              <option value="brand">Build brand awareness</option>
              <option value="conversion">Improve conversion rates</option>
              <option value="engagement">Increase engagement</option>
              <option value="retention">Improve customer retention</option>
              <option value="sales">Boost direct sales</option>
            </select>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              Current marketing challenges?
            </h2>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="E.g. Low social media engagement, poor ad performance..."
            />
          </div>

          <Link href="/dashboard">
            <button
              type="button"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              Get Personalized Recommendations
            </button>
          </Link>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
