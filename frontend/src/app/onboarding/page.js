"use client";
import React, { useState } from "react";
import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";
import { DOMAIN } from "../config";
import toast from "react-hot-toast";
import LoadingDots from "../components/LoadingDots";
import { motion } from "framer-motion";
import { withAuth } from "../components/ProtectedRoute";

function OnboardingPage() {
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

      // Redirect to chat
      router.push("/chat");
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
      <div className="max-w-xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
        >
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome to MarketMind AI
          </h1>
          <p className="text-gray-600 mb-8">
            Let's personalize your marketing assistant
          </p>

          <form className="space-y-7" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                What's your business name?
              </label>
              <input
                type="text"
                name="businessName"
                className={`w-full p-3.5 bg-gray-50 border ${
                  errors.businessName ? "border-red-300" : "border-gray-200"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
                placeholder="E.g. Acme Corp"
                value={formData.businessName}
                onChange={handleChange}
              />
              {errors.businessName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1.5"
                >
                  {errors.businessName}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                What industry are you in?
              </label>
              <select
                name="industry"
                className={`w-full p-3.5 bg-gray-50 border ${
                  errors.industry ? "border-red-300" : "border-gray-200"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none`}
                value={formData.industry}
                onChange={handleChange}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: `right 0.5rem center`,
                  backgroundRepeat: `no-repeat`,
                  backgroundSize: `1.5em 1.5em`,
                  paddingRight: `2.5rem`,
                }}
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
                  className="text-red-500 text-sm mt-1.5"
                >
                  {errors.industry}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your primary marketing goal?
              </label>
              <select
                name="goal"
                className={`w-full p-3.5 bg-gray-50 border ${
                  errors.goal ? "border-red-300" : "border-gray-200"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none`}
                value={formData.goal}
                onChange={handleChange}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: `right 0.5rem center`,
                  backgroundRepeat: `no-repeat`,
                  backgroundSize: `1.5em 1.5em`,
                  paddingRight: `2.5rem`,
                }}
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
                  className="text-red-500 text-sm mt-1.5"
                >
                  {errors.goal}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Current marketing challenges?
              </label>
              <textarea
                name="challenges"
                className={`w-full p-3.5 bg-gray-50 border ${
                  errors.challenges ? "border-red-300" : "border-gray-200"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[120px] transition-all duration-200`}
                placeholder="E.g. Low social media engagement, poor ad performance..."
                value={formData.challenges}
                onChange={handleChange}
              />
              {errors.challenges && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1.5"
                >
                  {errors.challenges}
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 flex justify-center items-center"
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
    </div>
  );
}

export default withAuth(OnboardingPage, {
  redirectAuthenticatedTo: "/chat",
});
