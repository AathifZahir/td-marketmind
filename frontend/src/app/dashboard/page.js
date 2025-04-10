"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { DOMAIN } from "../config";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial AI response when component mounts
  useEffect(() => {
    const fetchInitialResponse = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${DOMAIN}/api/chat/getLatestResponse`, {
          credentials: "include",
        });
        const data = await response.json();

        if (data.response) {
          setMessages((prev) => [
            ...prev,
            { text: data.response, isUser: false },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch initial response:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialResponse();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      // Add user message to chat
      setMessages((prev) => [...prev, { text: message, isUser: true }]);

      // Send to AI
      const response = await fetch(`${DOMAIN}/api/chat/ai-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ query: message }),
      });

      const data = await response.json();

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { text: data.response, isUser: false },
        ]);
      }

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar active="dashboard" />
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-4">
          {messages.length === 0 && isLoading ? (
            <div className="text-center py-8">Loading recommendations...</div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3xl p-4 rounded-lg ${
                    msg.isUser
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800 prose prose-sm sm:prose lg:prose-lg xl:prose-xl"
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
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex space-x-4">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your marketing question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
