import { io } from "socket.io-client";

<<<<<<< Updated upstream
const socket = io("http://localhost:5000");
=======
const socket = io("http://localhost:5000", {
  withCredentials: true,
});
>>>>>>> Stashed changes

socket.on("connect", () => {
  console.log("Socket Connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket Disconnected");
});

export default socket;