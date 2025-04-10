"use client";
import React, { useState } from "react";
import Link from "next/link";
import Navbar from "./components/navbar";
import { useRouter } from "next/navigation";
import { DOMAIN } from "./config";

export default function Onboarding() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    goal: "",
    challenges: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Generate user ID (with credentials)
      const userIdRes = await fetch(
        "http://localhost:3000/api/auth/generate-user-id",
        {
          credentials: "include", // This is crucial
        }
      );

      if (!userIdRes.ok) throw new Error("Failed to generate user ID");
      const { userId } = await userIdRes.json();

      // Step 2: Send onboarding data to AI (with credentials)
      const prompt = `Create marketing strategies for ${formData.businessName} in the ${formData.industry} industry. 
      Their primary goal is ${formData.goal} and they're facing these challenges: ${formData.challenges}. 
      Provide 3 specific recommendations.`;

      const aiRes = await fetch("http://localhost:3000/api/chat/ai-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This is crucial
        body: JSON.stringify({ query: prompt }),
      });

      if (!aiRes.ok) throw new Error("Failed to get AI response");
      const aiData = await aiRes.json();

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("An error occurred during onboarding. Please try again.");
    }
  };

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

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              What's your business name?
            </h2>
            <input
              type="text"
              name="businessName"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="E.g. Acme Corp"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              What industry are you in?
            </h2>
            <select
              name="industry"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.industry}
              onChange={handleChange}
              required
            >
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
            <select
              name="goal"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.goal}
              onChange={handleChange}
              required
            >
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
              name="challenges"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="E.g. Low social media engagement, poor ad performance..."
              value={formData.challenges}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            Get Personalized Recommendations
          </button>
        </form>
      </div>
    </div>
  );
}
