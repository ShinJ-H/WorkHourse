import express from "express";
import Message from "../models/Message.js";

const router = express.Router();


// SAVE MESSAGE
router.post("/", async (req, res) => {

  try {

    const {
      senderId,
      receiverId,
      message,
    } = req.body;

    const newMessage =
      await Message.create({
        senderId,
        receiverId,
        message,
      });

    res.status(201).json(newMessage);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});


// GET MESSAGES
router.get(
  "/:senderId/:receiverId",
  async (req, res) => {

    try {

      const {
        senderId,
        receiverId,
      } = req.params;

      const messages =
        await Message.find({
          $or: [
            {
              senderId,
              receiverId,
            },
            {
              senderId: receiverId,
              receiverId: senderId,
            },
          ],
        }).sort({
          createdAt: 1,
        });

      res.json(messages);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

export default router;