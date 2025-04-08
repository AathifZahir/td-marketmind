"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Navbar({ active }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
            <Link href="/dashboard" className="font-bold text-lg">
              MarketMind AI
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/dashboard"
              className={`${
                active === "dashboard"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600"
              } hover:text-blue-600`}
            >
              Dashboard
            </Link>
            <Link
              href="#"
              className={`${
                active === "campaigns"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600"
              } hover:text-blue-600`}
            >
              Campaigns
            </Link>
            <Link
              href="#"
              className={`${
                active === "analytics"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600"
              } hover:text-blue-600`}
            >
              Analytics
            </Link>
            <Link
              href="#"
              className={`${
                active === "settings"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600"
              } hover:text-blue-600`}
            >
              Settings
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600"
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/dashboard"
              className={`${
                active === "dashboard"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600"
              } block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="#"
              className={`${
                active === "campaigns"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600"
              } block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Campaigns
            </Link>
            <Link
              href="#"
              className={`${
                active === "analytics"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600"
              } block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Analytics
            </Link>
            <Link
              href="#"
              className={`${
                active === "settings"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600"
              } block px-3 py-2 rounded-md text-base font-medium`}
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
