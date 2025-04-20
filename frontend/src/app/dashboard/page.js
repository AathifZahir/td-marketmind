"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import { DOMAIN } from "../config";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";
import LoadingDots from "../components/LoadingDots";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const chatContainerRef = useRef(null);

  // Fetch chat history when component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${DOMAIN}/api/chat/history`, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch chat history");
        }

        const data = await response.json();
        if (data.messages) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
        toast.error(error.message || "Failed to load chat history");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchChatHistory();
    }
  }, [isAuthenticated]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      // Optimistically add user message
      setMessages((prev) => [...prev, { text: message, isUser: true }]);

      const response = await fetch(`${DOMAIN}/api/chat/ai-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ query: message }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();

      if (data.response) {
        setMessages(
          data.history || [...messages, { text: data.response, isUser: false }]
        );
        toast.success("Response received", { duration: 2000 });
      }

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(error.message || "Failed to send message");
      // Remove the optimistic message
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingDots />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access this page.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => (window.location.href = "/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-200"
          >
            Go to Login
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar active="dashboard" />
      <div className="max-w-4xl mx-auto pt-10 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-gray-800 mb-6"
        >
          Marketing Assistant
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 max-h-[70vh] overflow-y-auto"
          ref={chatContainerRef}
        >
          {messages.length === 0 && !isLoading ? (
            <div className="text-center py-12 text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
              <p className="text-gray-500">
                Start a conversation with your marketing assistant
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.isUser ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`max-w-3xl p-4 rounded-lg ${
                      msg.isUser
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-50 border border-gray-100 text-gray-800"
                    }`}
                    style={{
                      boxShadow: msg.isUser
                        ? "0 2px 5px rgba(79, 70, 229, 0.1)"
                        : "0 1px 3px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    {msg.isUser ? (
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => (
                            <p className="my-3" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-5 my-3" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal pl-5 my-3" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="my-1" {...props} />
                          ),
                          h1: ({ node, ...props }) => (
                            <h1
                              className="text-xl font-semibold my-4"
                              {...props}
                            />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2
                              className="text-lg font-semibold my-3"
                              {...props}
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3
                              className="text-md font-semibold my-2"
                              {...props}
                            />
                          ),
                          code: ({ node, inline, ...props }) =>
                            inline ? (
                              <code
                                className="bg-gray-200 rounded px-1 py-0.5 text-sm font-mono"
                                {...props}
                              />
                            ) : (
                              <code
                                className="block bg-gray-200 rounded p-1 text-sm font-mono"
                                {...props}
                              />
                            ),
                          pre: ({ node, ...props }) => (
                            <pre
                              className="bg-gray-100 p-3 rounded overflow-x-auto my-3 font-mono text-sm"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="max-w-3xl p-4 rounded-lg bg-gray-50 border border-gray-100">
                <LoadingDots />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex space-x-3"
        >
          <input
            type="text"
            className="flex-1 p-3.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            placeholder="Type your marketing question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center"
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
          >
            {isLoading ? (
              <>
                <LoadingDots />
                <span className="ml-2">Sending...</span>
              </>
            ) : (
              <span>Send</span>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
