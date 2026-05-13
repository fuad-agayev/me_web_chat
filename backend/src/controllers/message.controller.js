import { getMessages } from '../services/message.service.js';

export const getChat = async (req, res) => {
      const { userId } = req.params;
      const messages = await getMessages(req.user.id, userId)
      res.json(messages)
}