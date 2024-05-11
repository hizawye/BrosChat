"use client";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import React, { FormEvent, useState, useRef, useEffect } from "react";

export const Chat = () => {
  const [message, setMessage] = useState("");
  const createMessages = useMutation(api.messages.createMessages);
  const messages = useQuery(api.messages.getMessages);
  const [showNamePopup, setShowNamePopup] = useState(true);
  const [author, setAuthor] = useState(""); // Initial author state is empty

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
      <div className="bg-gray-700 p-8 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Choose a username:</h2>
        <form onSubmit={handleNameSubmit}>
          <input
            type="text"
            id="nameInput"
            className="border text-black border-gray-400 px-3 py-2 rounded-md w-full"
            required
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-emerald-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Chat
            </button>
          </div>
        </form>
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
    <div className="fixed flex flex-col h-screen justify-end">
      {showNamePopup && namePopup}
      <div
        ref={messagesContainerRef}
        className="sent-messages bg-gray-800 h-full overflow-y-auto flex flex-col p-4 rounded-t-lg"
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
                {message.author}
              </p>
              <p
                title={`sender: ${message.author}`}
                className="bg-emerald-700 p-2 rounded-sm inline-block bg-opacity-10 w-full"
              >
                {message.message}
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
