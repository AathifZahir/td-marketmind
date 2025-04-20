"use client";
import React from "react";
import Navbar from "../components/navbar";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            About MarketMind AI
          </h1>

          <div className="prose prose-indigo max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              MarketMind AI is an advanced marketing assistant powered by
              artificial intelligence, designed to help businesses of all sizes
              optimize their marketing strategies and achieve better results.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-6">
              Our mission is to democratize access to sophisticated marketing
              expertise through AI, enabling businesses to make data-driven
              decisions and implement effective marketing strategies without the
              need for expensive consultants or large marketing teams.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
              How We Help
            </h2>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-indigo-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>
                  <strong>Strategic Guidance:</strong> Get personalized
                  marketing strategies based on your business goals and
                  industry.
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-indigo-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>
                  <strong>Content Creation:</strong> Generate ideas and outlines
                  for marketing content that resonates with your audience.
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-indigo-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>
                  <strong>Campaign Optimization:</strong> Analyze your existing
                  campaigns and suggest improvements for better performance.
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-indigo-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>
                  <strong>Market Research:</strong> Stay informed about industry
                  trends and competitor strategies.
                </span>
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
              Our Technology
            </h2>
            <p className="text-gray-600 mb-6">
              MarketMind AI is built on state-of-the-art large language models
              and machine learning algorithms, trained on vast amounts of
              marketing data and best practices. Our system continuously learns
              and improves to provide you with the most relevant and effective
              marketing advice.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
              Get Started Today
            </h2>
            <p className="text-gray-600 mb-6">
              Ready to transform your marketing strategy? Complete our simple
              onboarding process to get personalized recommendations tailored to
              your business needs.
            </p>

            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => (window.location.href = "/onboarding")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                Start Your Journey
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
