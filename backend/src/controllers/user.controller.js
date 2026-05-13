import { getUsers } from '../services/user.service.js';

export const users = async (req, res) => {
      const data = await getUsers();
      res.json(data);
}
