import { MessageModel } from '../models/message.model.js';

export const sendMessageService = async (sender, receiver, content) => {
  return  await MessageModel.create(sender, receiver, content);
};

// export const getMessages = async (user1, user2) => {
//   return await MessageModel.getConversation(user1, user2);
// };

export const getMessages = async (
  senderId,
  receiverId
) => {

  const msgs =
    await MessageModel.getMessages(
      senderId,
      receiverId
    );

  for (const msg of msgs) {

    msg.reactions =
      await reactionModel.getReactions(msg.id);

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

