import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user; // from protect middleware

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ viewat: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
