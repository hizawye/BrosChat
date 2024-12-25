"use client";
import { api } from "@/convex/_generated/api";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import React, { FormEvent, useState, useRef, useEffect } from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import { Header } from "./Header";
import { UserProfile } from "@clerk/nextjs";

export const Chat = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    console.log('Authentication State:', {
      isSignedIn,
      isLoaded,
      userId: user?.id,
      userEmail: user?.primaryEmailAddress?.emailAddress,
    });
  }, [isSignedIn, isLoaded, user]);

  const [message, setMessage] = useState("");
  const createMessages = useMutation(api.messages.createMessages);
  const messages = useQuery(api.messages.getMessages);
  const [author, setAuthor] = useState(""); // Initial author state is empty

  // useEffect to handle sessionStorage and initial author
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuthor = sessionStorage.getItem("author");
      if (storedAuthor) {
        setAuthor(storedAuthor);
      }
    }
  }, []);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [showAuthor, setShowAuthor] = useState(true);
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }

    // Hide the author's name after messages are loaded
    setShowAuthor(false);

    // Set a timeout to show the author's name again after 5 minutes (300000 milliseconds)
    const timer = setTimeout(() => {
      setShowAuthor(true);
    }, 300000); // Adjust the time as needed

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [messages]);
  function handleOnSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return; // Don't send empty messages
    
    createMessages({ 
      message, 
      author: user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || 'Anonymous'
    });
    setMessage("");
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleOnSubmit(e as unknown as FormEvent);
    }
  };

  function handleNameSubmit(e: FormEvent) {
    e.preventDefault();
    const nameInput = document.getElementById("nameInput") as HTMLInputElement;
    const newAuthor = nameInput.value;
    setAuthor(newAuthor);
    sessionStorage.setItem("author", newAuthor);
  }

  const getColorForAuthor = (author: any) => {
    // Generate a consistent color based on the author's name
    const hash = author
      .toLowerCase()
      .split("")
      .reduce((acc: any, char: any) => {
        return (acc * 31 + char.charCodeAt(0)) % 360;
      }, 0);

    // Convert the hash to an HSL color
    const hue = hash;
    const saturation = "70%";
    const lightness = "50%";

    return `hsl(${hue}, ${saturation}, ${lightness})`;
  };
  return (
    <div className="fixed inset-0 flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header />
      <Authenticated>
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages?.map((message, index) => {
            const isSameAuthorAsPrevious =
              index > 0 && message.author === messages[index - 1].author;
            const isCurrentUser = message.author === (user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress);

            const authorColor = getColorForAuthor(message.author);
            
            return (
              <div key={message._id} 
                className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
              >
                {(!isSameAuthorAsPrevious || !isCurrentUser) && (
                  <p className="text-sm font-medium mb-1" style={{ color: authorColor }}>
                    {message.author}
                  </p>
                )}
                <div className={`max-w-[80%] break-words ${isCurrentUser ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-800 dark:text-white'} rounded-2xl px-4 py-2 shadow-sm`}>
                  <p>{message.message}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(message._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            );
          })}
        </div>
        <div className="border-t dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <form
            onSubmit={handleOnSubmit}
            className="max-w-4xl mx-auto flex items-center gap-4"
          >
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1 relative">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-4 py-3 rounded-full bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600"
                placeholder="Type your message..."
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-colors duration-200"
            >
              Send
            </button>
          </form>
        </div>
      </Authenticated>
      <Unauthenticated>
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">
              Welcome to BrosChat
            </h2>
            <div className="space-y-4">
              <div className="bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200 p-3 rounded-lg text-center">
                <SignInButton mode="modal" />
              </div>
              <div className="bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200 p-3 rounded-lg text-center">
                <SignUpButton mode="modal" />
              </div>
            </div>
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
};
