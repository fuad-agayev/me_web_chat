import {  getAllGlobalMessages } from '../services/global.service.js';


export const getGlobalChatMessages = async (req, res) => {
      try {
            const messages = await getAllGlobalMessages();
            res.json(messages);
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
}
