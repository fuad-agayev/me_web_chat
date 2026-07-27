import { formatAudioUrl } from "../utils/audio.js";
//import { formatAvatarUrl } from "../utils/avatar.js";
import {  getAllGlobalMessages, getLastGlobalMessageTimes, getPaginatedGlobalMessages, fetchGlobalOnlineUsers } from '../services/global.service.js'


export const getGlobalChatMessages = async (req, res) => {
  try {
    const messages = await getAllGlobalMessages();
    const formatted = messages.map(m => ({
      ...m,
     // avatar: formatAvatarUrl(m.avatar),
      audio_url: formatAudioUrl(m.audio_url)
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchGlobalPaginatedMessages = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const messages = await getPaginatedGlobalMessages(Number(limit), Number(offset));
    const formatted = messages.map(m => ({
      ...m,
      //avatar: formatAvatarUrl(m.avatar),
      audio_url: formatAudioUrl(m.audio_url)
    }));
    res.json(formatted);
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

