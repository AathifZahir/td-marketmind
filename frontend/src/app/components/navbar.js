"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Navbar({ active }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center py-5">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-full opacity-90"></div>
            <Link
              href="/dashboard"
              className="font-medium text-lg text-gray-800"
            >
              MarketMind AI
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            <Link
              href="/dashboard"
              className={`${
                active === "dashboard"
                  ? "text-indigo-600 font-medium"
                  : "text-gray-600"
              } hover:text-indigo-600 transition-colors duration-200`}
            >
              Dashboard
            </Link>
            <Link
              href="#"
              className={`${
                active === "campaigns"
                  ? "text-indigo-600 font-medium"
                  : "text-gray-600"
              } hover:text-indigo-600 transition-colors duration-200`}
            >
              Campaigns
            </Link>
            <Link
              href="#"
              className={`${
                active === "analytics"
                  ? "text-indigo-600 font-medium"
                  : "text-gray-600"
              } hover:text-indigo-600 transition-colors duration-200`}
            >
              Analytics
            </Link>
            <Link
              href="#"
              className={`${
                active === "settings"
                  ? "text-indigo-600 font-medium"
                  : "text-gray-600"
              } hover:text-indigo-600 transition-colors duration-200`}
            >
              Settings
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/dashboard"
              className={`${
                active === "dashboard"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600"
              } block px-3 py-2.5 rounded-md text-base font-medium transition-colors duration-200`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="#"
              className={`${
                active === "campaigns"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600"
              } block px-3 py-2.5 rounded-md text-base font-medium transition-colors duration-200`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Campaigns
            </Link>
            <Link
              href="#"
              className={`${
                active === "analytics"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600"
              } block px-3 py-2.5 rounded-md text-base font-medium transition-colors duration-200`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Analytics
            </Link>
            <Link
              href="#"
              className={`${
                active === "settings"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600"
              } block px-3 py-2.5 rounded-md text-base font-medium transition-colors duration-200`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
