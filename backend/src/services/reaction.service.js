import { groupModel } from '../models/group.model.js';

import { addReaction, removeReaction } from '../models/reaction.model.js'

export const reactToMessage = async (messageId, userId, emoji, groupId) => {
      const isMember = await groupModel.isMember(groupId, userId);

      if(!isMember) throw new Error("User is not a memeber of the group")

        return await addReaction(messageId, userId, emoji)
}


export const removeReactionFromMessage = async (
  messageId,
  userId,
  emoji,
  groupId
) => {

  const isMember =
    await groupModel.isMember(groupId, userId);

  if (!isMember) {
    throw new Error("User is not a member");
  }

  return await removeReaction(
    messageId,
    userId,
    emoji
  );
};