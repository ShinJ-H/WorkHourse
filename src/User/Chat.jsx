import { useEffect, useRef, useState, } from "react";
import axios from "axios";
import socket from "../socket";

const Chat = () => {

  // Logged In User
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // States
  const [users, setUsers] =useState([]);

  const [receiverId, setReceiverId] =useState("");

  const [receiverName, setReceiverName] =useState("");

  const [message, setMessage] =useState("");

  const [messages, setMessages] =useState([]);

  const [typing, setTyping] =useState(false);

  const [onlineUsers, setOnlineUsers] =useState([]);

  const chatEndRef = useRef(null);

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
    setMessages((prev) => [
      ...prev,
      msgData,
    ]);

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

    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-[30%] bg-white border-r overflow-y-auto">

        <div className="bg-green-700 text-white p-4 text-xl font-bold">
          WorkHouse Chat
        </div>

        {users.map((u) => (

          <div
            key={u._id}
            onClick={() =>
              selectUser(u)
            }
            className={`flex items-center gap-3 p-4 border-b cursor-pointer hover:bg-gray-100 transition
            ${receiverId === u._id
                ? "bg-green-100"
                : ""
              }`}
          >

            {/* Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">

              {u.profilePic ? (

                <img
                  src={`http://localhost:5000/uploads/${u.profilePic}`}
                  alt=""
                  className="w-full h-full object-cover"
                />

              ) : (

                <div className="w-full h-full flex items-center justify-center text-white bg-green-500 font-bold">
                  {u.name?.charAt(0)}
                </div>
              )}
            </div>

            <div>

              <h3 className="font-semibold">
                {u.name}
              </h3>

              <p
                className={`text-sm ${onlineUsers.includes(
                  u._id
                )
                    ? "text-green-600"
                    : "text-gray-500"
                  }`}
              >
                {onlineUsers.includes(
                  u._id
                )
                  ? "Online"
                  : "Offline"}
              </p>

            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="bg-green-700 text-white p-4 flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-white overflow-hidden">
          </div>

          <div>

            <h2 className="font-semibold text-lg">
              {receiverName ||
                "Select User"}
            </h2>

            <p className="text-sm text-green-100">

              {typing
                ? "Typing..."
                : onlineUsers.includes(
                  receiverId
                )
                  ? "Online"
                  : "Offline"}

            </p>

          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-[#ece5dd] p-4 flex flex-col gap-2">

          {messages.map(
            (msg, index) => (

              <div
                key={index}
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-sm
                ${msg.senderId?.toString() ===
                    currentUser._id
                    ? "bg-green-200 self-end"
                    : "bg-white self-start"
                  }`}
              >
                {msg.message}
              </div>
            )
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input */}
        {receiverId && (

          <div className="bg-white p-4 border-t flex gap-2">

            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={
                handleTypingInput
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-green-500 hover:bg-green-600 text-white px-6 rounded-full transition"
            >
              Send
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;