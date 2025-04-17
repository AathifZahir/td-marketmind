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

// This is the AI chat
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
    // Redirect to login or show unauthorized message
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access this page.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
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
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800 mb-6"
        >
          Dashboard
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-4 max-h-[70vh] overflow-y-auto"
          ref={chatContainerRef}
        >
          {messages.length === 0 && !isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Start a conversation with your marketing assistant
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-3xl p-4 rounded-lg ${
                      msg.isUser
                        ? "bg-blue-600 text-white shadow-blue-200 shadow-md"
                        : "bg-white border border-gray-100 text-gray-800 shadow-sm prose prose-sm sm:prose lg:prose-lg xl:prose-xl"
                    }`}
                  >
                    {msg.isUser ? (
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => (
                            <p className="my-4" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-6 my-4" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal pl-6 my-4" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="my-2" {...props} />
                          ),
                          code: ({ node, ...props }) => (
                            <code
                              className="bg-gray-200 rounded px-1 py-0.5 text-sm"
                              {...props}
                            />
                          ),
                          pre: ({ node, ...props }) => (
                            <pre
                              className="bg-gray-100 p-4 rounded overflow-x-auto my-4"
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
              <div className="max-w-3xl p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
                <LoadingDots />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex space-x-4"
        >
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Type your marketing question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors disabled:opacity-50 flex items-center"
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
          >
            {isLoading ? (
              <>
                <LoadingDots />
                <span className="ml-2">Sending...</span>
              </>
            ) : (
              "Send"
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
