import { io } from "socket.io-client";

const socket = io("http://192.168.29.34:5000", {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Socket Connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket Disconnected");
});

export default socket;