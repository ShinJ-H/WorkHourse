import axios from "axios";
import React, { useState, useEffect } from "react";

export default function ChatBot() {
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // ✅ Load chats (fixed)
    useEffect(() => {
        if (loaded) return;

        const saved = JSON.parse(localStorage.getItem("allChats")) || [];

        if (saved.length === 0) {
            const newChat = {
                id: Date.now(),
                title: "New Chat",
                messages: []
            };
            setChats([newChat]);
            setCurrentChatId(newChat.id);
        } else {
            setChats(saved);
            setCurrentChatId(saved[0].id);
        }

        setLoaded(true);
    }, [loaded]);

    // ✅ Save chats
    useEffect(() => {
        if (loaded) {
            localStorage.setItem("allChats", JSON.stringify(chats));
        }
    }, [chats, loaded]);

    const currentChat = chats.find(c => c.id === currentChatId);

    // ✅ New chat
    const createNewChat = () => {
        const newChat = {
            id: Date.now(),
            title: "New Chat",
            messages: []
        };

        setChats(prev => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
    };

    //Delete chats
    const deleteChat = (id) => {
        const updatedChats = chats.filter(chat => chat.id !== id);

        if (updatedChats.length === 0) {
            const newChat = {
                id: Date.now(),
                title: "New Chat",
                messages: []
            };
            setChats([newChat]);
            setCurrentChatId(newChat.id);
        } else {
            setChats(updatedChats);
            setCurrentChatId(updatedChats[0].id);
        }
    };

    // ✅ Update chat
    const updateChat = (messages) => {
        setChats(prev =>
            prev.map(chat =>
                chat.id === currentChatId
                    ? {
                        ...chat,
                        messages,
                        title: messages[0]?.text.slice(0, 20) || "Chat"
                    }
                    : chat
            )
        );
    };

    // ✅ Send message
    const handleChatBot = async () => {

        if (!input.trim() || loading) return;

        if (!currentChatId) {
            createNewChat();
            return;
        }

        const updatedMessages = [
            ...(currentChat?.messages || []),
            { text: input, sender: "user" }
        ];

        updateChat(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/api/chat", {
                messages: updatedMessages.map(m => m.text)
            });

            const reply = res?.data?.reply || "No reply";

            updateChat([
                ...updatedMessages,
                { text: reply, sender: "bot" }
            ]);

        } catch (error) {

            let msg = "Error from server";

            if (error?.response?.status === 503) {
                msg = "Server busy, try again";
            }

            if (error?.response?.status === 429) {
                msg = "Rate limit reached";
            }

            updateChat([
                ...updatedMessages,
                { text: msg, sender: "bot" }
            ]);
        }

        setLoading(false);
    };
    return (
        <>
            <div className="flex h-screen">

                {/* Sidebar */}
                <div className="w-1/4 border-r border-gray-300 p-4 bg-slate-50">
                    <button
                        onClick={createNewChat}
                        className="bg-purple-900 hover:bg-purple-800 text-white w-full p-3 mb-4 rounded-lg font-semibold transition duration-200"
                    >
                        + New Chat
                    </button>

                    <div className="space-y-2">
                        {chats.map(chat => (
                            <div
                                key={chat.id}
                                className={`flex justify-between items-center p-3 rounded-lg border transition duration-200 ${
                                    chat.id === currentChatId
                                        ? "bg-purple-100 border-purple-300 shadow-md"
                                        : "bg-white border-gray-200 hover:bg-gray-100"
                                }`}
                            >
                                <span
                                    onClick={() => setCurrentChatId(chat.id)}
                                    className="cursor-pointer w-full font-medium text-sm text-gray-700 truncate"
                                >
                                    {chat.title}
                                </span>

                                <button
                                    onClick={() => deleteChat(chat.id)}
                                    className="text-red-500 hover:text-red-700 ml-2 font-semibold text-xs"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat */}
                <div className="w-3/4 p-6 flex flex-col bg-white">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentChat?.title || "Chat"}</h2>

                    <div className="flex-1 overflow-y-auto border border-gray-300 p-6 mb-4 bg-gradient-to-b from-slate-50 to-white rounded-lg shadow-sm space-y-4">
                        {currentChat?.messages?.length > 0 ? (
                            currentChat.messages.map((m, i) => {
                                const lines = m.text.split('\n\n');
                                const isUser = m.sender === "user";
                                return (
                                    <div
                                        key={i}
                                        className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        {!isUser && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-md">
                                                🤖
                                            </div>
                                        )}
                                        <div className={`inline-block max-w-2xl rounded-xl shadow-md border ${
                                            isUser
                                                ? "bg-purple-900 text-white border-purple-900 rounded-br-none"
                                                : "bg-indigo-50 text-gray-900 border-purple-200 rounded-bl-none"
                                        } p-4`}>
                                            {lines.map((line, idx) => {
                                                if (!line.trim()) return null;
                                                const isBold = line.startsWith('**') && line.endsWith('**');
                                                const isHeading = line.length < 60 && (isBold || line.includes(':'));
                                                const content = isBold ? line.replace(/\*\*/g, '') : line;

                                                return (
                                                    <div key={idx} className={idx > 0 ? "mt-3" : ""}>
                                                        {isHeading ? (
                                                            <h3 className={`text-base font-bold mb-2 ${
                                                                isUser ? "text-purple-100" : "text-purple-900"
                                                            }`}>
                                                                📌 {content}
                                                            </h3>
                                                        ) : (
                                                            <p className={`text-sm leading-relaxed ${
                                                                isUser ? "text-white" : "text-gray-800"
                                                            }`}>
                                                                {content}
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {isUser && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-md">
                                                👤
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-center text-gray-400 text-lg">No messages yet. Start a conversation!</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleChatBot()}
                            className="flex-1 border-2 border-gray-300 p-3 rounded-lg focus:border-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-200"
                            placeholder="Type your message..."
                        />
                        <button
                            onClick={handleChatBot}
                            disabled={loading}
                            className="bg-purple-900 hover:bg-purple-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md"
                        >
                            {loading ? "Thinking..." : "Send"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}