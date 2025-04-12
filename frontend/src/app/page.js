"use client";
import React, { useState } from "react";
import Link from "next/link";
import Navbar from "./components/navbar";
import { useRouter } from "next/navigation";
import { DOMAIN } from "./config";
import toast from "react-hot-toast";
import LoadingDots from "./components/LoadingDots";
import { motion } from "framer-motion";

export default function Onboarding() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    goal: "",
    challenges: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!formData.industry) {
      newErrors.industry = "Please select an industry";
    }

    if (!formData.goal) {
      newErrors.goal = "Please select a goal";
    }

    if (!formData.challenges.trim()) {
      newErrors.challenges = "Please describe your challenges";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);

    try {
      // Show loading toast
      const loadingToast = toast.loading("Setting up your account...");

      // Generate user ID
      const userIdRes = await fetch(`${DOMAIN}/api/auth/generate-user-id`, {
        credentials: "include",
      });

      if (!userIdRes.ok) {
        const error = await userIdRes.json();
        throw new Error(error.details || "Failed to generate user ID");
      }

      // Send onboarding data
      const aiRes = await fetch(
        `${DOMAIN}/api/chat/generateInitialRecommendations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (!aiRes.ok) {
        const error = await aiRes.json();
        throw new Error(error.details || "Failed to get AI response");
      }

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Account setup complete!");

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error(error.message || "An error occurred during onboarding");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10"
      >
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
              className={`w-full p-3 border ${
                errors.businessName ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              placeholder="E.g. Acme Corp"
              value={formData.businessName}
              onChange={handleChange}
            />
            {errors.businessName && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.businessName}
              </motion.p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              What industry are you in?
            </h2>
            <select
              name="industry"
              className={`w-full p-3 border ${
                errors.industry ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              value={formData.industry}
              onChange={handleChange}
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
            {errors.industry && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.industry}
              </motion.p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              Your primary marketing goal?
            </h2>
            <select
              name="goal"
              className={`w-full p-3 border ${
                errors.goal ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              value={formData.goal}
              onChange={handleChange}
            >
              <option value="">Select a goal</option>
              <option value="leads">Generate more leads</option>
              <option value="brand">Build brand awareness</option>
              <option value="conversion">Improve conversion rates</option>
              <option value="engagement">Increase engagement</option>
              <option value="retention">Improve customer retention</option>
              <option value="sales">Boost direct sales</option>
            </select>
            {errors.goal && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.goal}
              </motion.p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              Current marketing challenges?
            </h2>
            <textarea
              name="challenges"
              className={`w-full p-3 border ${
                errors.challenges ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] transition-all duration-200`}
              placeholder="E.g. Low social media engagement, poor ad performance..."
              value={formData.challenges}
              onChange={handleChange}
            />
            {errors.challenges && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.challenges}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {isSubmitting ? (
              <>
                <LoadingDots />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              "Get Personalized Recommendations"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
