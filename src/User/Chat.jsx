import { useEffect, useRef, useState } from "react";
import axios from "axios";
import socket from "../socket";

const Chat = () => {

  // Logged In User
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const colorPresets = [
    "from-violet-500/25 via-fuchsia-500/15 to-cyan-500/20",
    "from-cyan-500/25 via-blue-500/15 to-violet-500/20",
    "from-pink-500/25 via-rose-500/15 to-orange-400/15",
  ];

  const getUserGradient = (id) => {
    if (!id) return colorPresets[0];
    const index = [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % colorPresets.length;
    return colorPresets[index];
  };

  // States
  const [users, setUsers] = useState([]);

  const [receiverId, setReceiverId] = useState("");

  const [receiverName, setReceiverName] =useState("");

  const [message, setMessage] =useState("");

  const [messages, setMessages] =useState([]);

  const [typing, setTyping] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const chatEndRef = useRef(null);
  const searchInputRef = useRef(null);

  // Restore Chat
  useEffect(() => {

    const savedChat = JSON.parse(localStorage.getItem("selectedChat"));

    if (savedChat) {
      setReceiverId(savedChat.receiverId);
      setReceiverName(savedChat.receiverName);
    }
  }, []);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token =currentUser?.token;
        const res = await axios.get(
          "http://localhost:5000/api/users",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const filteredUsers =res.data.filter((u) =>u._id !== currentUser._id);
        setUsers(filteredUsers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  // Socket Setup
  useEffect(() => {
    if (!currentUser?._id) return;
    // JOIN
    socket.emit(
      "join",
      currentUser._id
    );
    // RECEIVE MESSAGE
    const handleReceiveMessage =
      (data) => {
        if (
          data.senderId === receiverId ||
          data.receiverId === receiverId
        ) {
          setMessages((prev) => [
            ...prev,
            data,
          ]);
        }
      };
    // TYPING
    const handleTyping = () => {setTyping(true); 
      setTimeout(() => {
        setTyping(false);
      }, 2000);
    };

    // ONLINE USERS
    const handleOnlineUsers =(users) => {
        setOnlineUsers(users);
      };

    socket.on("receiveMessage",
      handleReceiveMessage
    );
    socket.on(
      "typing",
      handleTyping
    );

    socket.on(
      "onlineUsers",
      handleOnlineUsers
    );
    return () => {
      socket.off(
        "receiveMessage",
        handleReceiveMessage
      );
      socket.off(
        "typing",
        handleTyping
      );

      socket.off(
        "onlineUsers",
        handleOnlineUsers
      );
    };

  }, [currentUser, receiverId]);

  // Fetch Messages
  useEffect(() => {

    const fetchMessages = async () => {

      if (!receiverId) return;

      try {

        const res = await axios.get(
          `http://localhost:5000/api/messages/${currentUser._id}/${receiverId}`
        );

        setMessages(res.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();

  }, [receiverId]);

  // Send Message
  const sendMessage = async () => {

    if (
      !message.trim() ||
      !receiverId
    ) return;

    const msgData = {
      senderId: currentUser._id,
      receiverId,
      message,
    };

    // SOCKET
    socket.emit(
      "sendMessage",
      msgData
    );

    // SAVE TO DB
    try {

      await axios.post(
        "http://localhost:5000/api/messages",
        msgData
      );

    } catch (error) {
      console.log(error);
    }

    // UI UPDATE
    // Removed optimistic update to prevent duplicate messages.
    setMessage("");
  };

  // Typing Input
  const handleTypingInput = (e) => {

    setMessage(e.target.value);

    socket.emit("typing", {
      senderId: currentUser._id,
      receiverId,
    });
  };

  // Auto Scroll
  useEffect(() => {

    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  // Select User
  const selectUser = (user) => {

    setReceiverId(user._id);

    setReceiverName(user.name);

    localStorage.setItem(
      "selectedChat",
      JSON.stringify({
        receiverId: user._id,
        receiverName: user.name,
      })
    );
  };

  // Not Logged In
  if (!currentUser?._id) {

    return (
      <div className="flex items-center justify-center h-screen text-2xl font-bold">
        Please Login
      </div>
    );
  }

  return (
    <div className="relative text-slate-100">
      <svg className="hidden" aria-hidden="true" focusable="false">
        <symbol id="chat-icon-search" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M10 2a8 8 0 1 1-4.9 14.2l-3.4 3.4a1 1 0 0 1-1.4-1.4l3.4-3.4A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12a6 6 0 0 0 0-12Z"
          />
        </symbol>
        <symbol id="chat-icon-send" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M3.1 20.3a1 1 0 0 1-.9-1.1L4 6.1a1 1 0 0 1 1.4-.8l15.2 7.3a1 1 0 0 1 0 1.8L5.4 20.2a1 1 0 0 1-.3.1ZM6 10.8l11.1 5.3L6 15.8v-5Z"
          />
        </symbol>
        <symbol id="chat-icon-dot" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" fill="currentColor" />
        </symbol>
      </svg>
        <div className="flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-xl shadow-black/20">
          <div className="flex flex-1 flex-col lg:flex-row">
            <aside className="flex w-80 sm:w-96 flex-col overflow-y-auto border-b border-white/10 bg-slate-200 lg:w-96 lg:border-b-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
              <div className="sticky top-0 z-10 flex flex-col gap-1 border-b border-white/10 bg-slate-300 px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-700">Contacts</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search teammates"
                    className="flex-1 rounded-2xl border border-white/10 bg-slate-900/80 px-2 py-1 text-xs text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => searchInputRef.current?.focus()}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20 transition hover:bg-fuchsia-400"
                    aria-label="Focus search"
                  >
<<<<<<< Updated upstream
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-xl font-semibold text-white ring-1 ring-white/10">
                      {u.profilePic ? (
                        <img
                          src={`http://localhost:5000/uploads/${u.profilePic}`}
                          alt={u.name}
                          className="h-full w-full rounded-3xl object-cover"
                        />
                      ) : (
                        u.name?.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-white">{u.name}</h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                            onlineUsers.includes(u._id)
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          <svg className="h-2.5 w-2.5 text-current" aria-hidden="true">
                            <use href="#chat-icon-dot" />
                          </svg>
                          {onlineUsers.includes(u._id) ? "Online" : "Offline"}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-400">Tap to open conversation.</p>
                    </div>
=======
                    <svg className="h-5 w-5" aria-hidden="true">
                      <use href="#chat-icon-search" />
                    </svg>
>>>>>>> Stashed changes
                  </button>
                </div>
              </div>
              <div className="flex-1 divide-y divide-slate-400 overflow-y-auto px-4 py-3 scrollbar scrollbar-thumb-slate-400 scrollbar-track-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <button
                      key={u._id}
                      type="button"
                      onClick={() => selectUser(u)}
                      className={`group flex w-full cursor-pointer items-center gap-3 rounded-[1.75rem] px-4 py-4 text-left transition duration-300 ${
                        receiverId === u._id
                          ? "bg-purple-900/35 ring-1 ring-purple-300/30 shadow-xl shadow-purple-500/10"
                          : "bg-slate-900/30 ring-1 ring-white/10 hover:bg-slate-900/50"
                      }`}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-base font-semibold text-white ring-1 ring-white/10 ${
                        onlineUsers.includes(u._id)
                          ? "bg-purple-900/70"
                          : "bg-slate-800"
                      }`}>
                        {u.profilePic ? (
                          <img
                            src={`http://localhost:5000/uploads/${u.profilePic}`}
                            alt={u.name}
                            className="h-full w-full rounded-3xl object-cover"
                          />
                        ) : (
                          u.name?.charAt(0)
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-xs font-semibold text-white">{u.name}</h3>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] ${
                              onlineUsers.includes(u._id)
                                ? "bg-emerald-500/10 text-emerald-300"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            <svg className="h-2.5 w-2.5 text-current" aria-hidden="true">
                              <use href="#chat-icon-dot" />
                            </svg>
                            {onlineUsers.includes(u._id) ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32 text-slate-400">
                    <span className="text-sm">No users found</span>
                  </div>
                )}
              </div>
            </aside>

            <main className="flex-1 flex flex-col bg-gradient-to-b from-white/95 to-white/90 text-slate-900 p-4 sm:p-6">
              {/* Chat Header */}
              <div className="mb-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-violet-600/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-200 font-semibold">{receiverName || "Select a contact"}</p>
                    <p className="mt-1.5 text-xs text-slate-400">
                      {receiverId
                        ? typing
                          ? "Typing..."
                          : onlineUsers.includes(receiverId)
                          ? "Online"
                          : "Offline"
                        : "No active chat selected"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-purple-500 p-4 mb-1 max-h-[58vh] scrollbar scrollbar-thumb-violet-600 scrollbar-track-slate-900/30">
                {messages.length === 0 ? (
                  <div className="flex h-full min-h-[28vh] items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-purple-900/90">
                    <div className="text-center">
                      <p className="text-lg text-slate-300">No messages yet</p>
                      <p className="mt-2 text-sm text-slate-400">Send your first message to start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-purple-100">
                    {messages.map((msg, index) => {
                      const isMine = msg.senderId?.toString() === currentUser._id;
                      return (
                        <div key={index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-xs lg:max-w-md px-3 py-2 mx-2 my-2 rounded-2xl shadow-lg text-[13px] leading-relaxed ${
                            isMine
                              ? "bg-purple-900 text-white"
                              : "bg-purple-700 text-white"
                          }`}>
                            <p className="break-words">{msg.message}</p>
                            {msg.createdAt && (
                              <div className={`mt-2 flex justify-end text-xs ${isMine ? "text-slate-300" : "text-slate-400"}`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
                <div className="mt-0 flex items-center gap-3 bg-purple-500/90 rounded-xl px-3 py-2 border border-white/10">
                  <input
                    type="text"
                    placeholder={receiverId ? "Type your message..." : "Select a user first..."}
                    value={message}
                    onChange={handleTypingInput}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    disabled={!receiverId}
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={!receiverId}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-900 text-white border border-white/10 shadow-sm hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Send message"
                  >
                    <svg className="h-5 w-5" aria-hidden="true">
                      <use href="#chat-icon-send" />
                    </svg>
                  </button>
                </div>
            </main>
          </div>
        </div>
    </div>
  );

  };

export default Chat;