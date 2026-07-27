import { MessageModel } from '../models/message.model.js';
import { getReactions } from '../models/reaction.model.js'

export const sendMessageService = async (sender, receiver, content, audio_url) => {
  return  await MessageModel.create(sender, receiver, content, audio_url);
};


export const getMessages = async (senderId, receiverId) => {
  const msgs = await MessageModel.getConversation(senderId, receiverId);

  for (const msg of msgs) {
    msg.reactions = await getReactions(msg.id);
  }

  return msgs;
};

export const markMessageAsRead = async (messageId) => {
     return await MessageModel.markedAsRead(messageId);
};

export const markMessageAsDelivered = async (messageId) => {
     return await MessageModel.markedAsDelivered(messageId);
};

export const editMessageService = async (messageId, userId, content) =>{
     return await MessageModel.editedMessageService(messageId,userId,content);
};

export const deleteMessageService = async (messageId, userId) => {
     return await MessageModel.deletedMessageService(messageId, userId);
}

