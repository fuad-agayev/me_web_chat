import { groupModel } from '../models/group.model.js';
import { getReactions } from '../models/reaction.model.js';


// CREATE GROUP
export const createGroup = async (name, userId) => {

  const group =
    await groupModel.createGroup(name, userId);

  await groupModel.addMember(group.id, userId);

  return group;
};


// GET USER GROUPS
export const getUserGroup = async (userId) => {

  return await groupModel.getUsersGroups(userId);

};


// GET GROUP MESSAGES
export const getGroupMessages = async (
  groupId,
  userId
) => {

  const isMember =
    await groupModel.isMember(groupId, userId);

  if (!isMember) {
    throw new Error("Not a member");
  }

  const msgs =
    await groupModel.getMessages(groupId);

  for (const msg of msgs) {

    msg.reactions =
      await getReactions(msg.id);

  }

  return msgs;
};


// SEND GROUP MESSAGE
export const sendGroupMessage = async (
  groupId,
  userId,
  content
) => {

  const isMember =
    await groupModel.isMember(groupId, userId);

  if (!isMember) {
    throw new Error(
      'User is not a member of the group'
    );
  }

  return await groupModel.createMessage(
    groupId,
    userId,
    content
  );
};


// EDIT GROUP MESSAGE
export const editGroupMessage = async (
  messageId,
  groupId,
  userId,
  content
) => {

  const isMember =
    await groupModel.isMember(groupId, userId);

  if (!isMember) {
    throw new Error(
      'User is not a member of the group'
    );
  }

  return await groupModel.editMessage(
    messageId,
    userId,
    content
  );
};


// DELETE GROUP MESSAGE
export const deleteGroupMessage = async (
  messageId,
  groupId,
  userId
) => {

  const isMember =
    await groupModel.isMember(groupId, userId);

  if (!isMember) {
    throw new Error(
      'Not a member of the group'
    );
  }

  return await groupModel.deleteMessage(
    messageId,
    userId
  );
};
