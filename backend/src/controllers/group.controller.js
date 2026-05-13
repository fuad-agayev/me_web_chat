import * as groupService from '../services/group.service.js'

export const createGroup = async (req, res) => {

  const userId = req.user.id;
  const { name } = req.body

  const group = await groupService.createGroup(name, userId);

  res.json(group);
}

export const getMyGroups = async (req, res) => {
  const groups = await groupService.getUserGroup(req.user.id)
 res.json(groups);
}


export const getMessages = async (req, res) => {
  const groupId = req.params.groupId;

  const msgs = await groupService.getGroupMessages(groupId, req.user.id);
  res.json(msgs);
}
