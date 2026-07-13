import {  getAllGlobalMessages, getLastGlobalMessageTimes, getPaginatedGlobalMessages, fetchGlobalOnlineUsers } from '../services/global.service.js'

export const getGlobalChatMessages = async (req, res) => {
      try {
            const messages = await getAllGlobalMessages();
            res.json(messages);
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
}

export const fetchGlobalPaginatedMessages = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const messages = await getPaginatedGlobalMessages(Number(limit), Number(offset));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGlobalOnlineUsers = async (req, res) => {
  try{
    const onlineUsers = await fetchGlobalOnlineUsers();
    res.json(onlineUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getGlobalLastMessages = async (req, res) => {
  try {
    const lastMessages = await getLastGlobalMessageTimes();
    res.json(lastMessages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

