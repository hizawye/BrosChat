"use client";
import { api } from "@/convex/_generated/api";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import React, { FormEvent, useState, useRef, useEffect } from "react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Header } from "./Header";
import { UserProfile } from "@clerk/nextjs";

export const Chat = () => {
  const [message, setMessage] = useState("");
  const createMessages = useMutation(api.messages.createMessages);
  const messages = useQuery(api.messages.getMessages);
  const [showNamePopup, setShowNamePopup] = useState(true);
  const [author, setAuthor] = useState(""); // Initial author state is empty

  const realAuthor = useQuery(api.messages.getAuthor);

  // useEffect to handle sessionStorage and initial author
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuthor = sessionStorage.getItem("author");
      if (storedAuthor) {
        setAuthor(storedAuthor);
        setShowNamePopup(false); // Hide the name popup if author is found
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
    createMessages({ message, author });
    setMessage("");
  }

  function handleNameSubmit(e: FormEvent) {
    e.preventDefault();
    const nameInput = document.getElementById("nameInput") as HTMLInputElement;
    const newAuthor = nameInput.value;
    setAuthor(newAuthor);
    sessionStorage.setItem("author", newAuthor);
    setShowNamePopup(false);
  }

  const namePopup = (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-700 p-8 rounded-lg flex items-center flex-col">
        <h2 className="bg-green-900 p-2 rounded-lg text-xl font-bold mb-4">
          <SignUpButton />
        </h2>

        <h2 className="bg-green-900 p-2 rounded-lg text-xl font-bold mb-4">
          <SignInButton />
        </h2>
      </div>
    </div>
  );
  function getColorForAuthor(author: any) {
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
  }
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden md:w-1/2 md:static md:h-screen">
      <Unauthenticated>{showNamePopup && namePopup}</Unauthenticated>
      <Header />
      <div
        ref={messagesContainerRef}
        className="sent-messages bg-gray-900 h-full overflow-y-auto flex flex-col p-4 rounded-t-lg"
      >
        {messages?.map((message, index) => {
          const isSameAuthorAsPrevious =
            index > 0 && message.author === messages[index - 1].author;

          const authorColor =
            message.author.toLowerCase() === " rahim "
              ? "red"
              : getColorForAuthor(message.author);
          return (
            <div key={message._id} className="mb-2">
              <p className="font-thin text-sm" style={{ color: authorColor }}>
                {realAuthor}
              </p>
              <p
                title={`sender: ${message.author}`}
                className="bg-emerald-700 p-2 rounded-sm inline-block bg-opacity-10 w-full"
              >
                {message.message}
              </p>
              <p className="font-thin text-sm text-gray-500 text-right">
                {new Date(message._creationTime).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="send-message sticky bottom-0  w-full p-4 bg-gray-900 rounded-b-lg">
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-row gap-2 justify-between"
        >
          <UserButton />
          <p>{realAuthor}</p>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border-emerald-900 rounded-md text-emerald-950"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-900 text-white rounded-md"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
