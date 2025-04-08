"use client";
import React, { useState } from "react";
import Navbar from "../components/navbar";

export default function Dashboard() {
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar active="dashboard" />

      <div className="max-w-4xl mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div>
              <h2 className="font-medium text-gray-800">
                Welcome back, Acme Corp!
              </h2>
              <div className="mt-2 text-gray-700 space-y-3">
                <p>
                  Based on your goals to{" "}
                  <span className="font-medium">improve conversion rates</span>{" "}
                  and challenges with{" "}
                  <span className="font-medium">
                    low social media engagement
                  </span>
                  , here's my recommendation:
                </p>
                <p>
                  1.{" "}
                  <span className="font-medium">
                    Optimize your Instagram content:
                  </span>{" "}
                  Focus on carousel posts with customer testimonials and product
                  benefits.
                </p>
                <p>
                  2.{" "}
                  <span className="font-medium">
                    Run a retargeting campaign:
                  </span>{" "}
                  Target visitors who spent more than 30 seconds on your pricing
                  page.
                </p>
                <p>
                  3.{" "}
                  <span className="font-medium">
                    A/B test your CTA buttons:
                  </span>{" "}
                  Try "Get Started Free" vs "See Pricing Plans" to see which
                  converts better.
                </p>
                <p>
                  Would you like me to create a detailed campaign plan for any
                  of these?
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your marketing question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
            onClick={() => setMessage("")}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
