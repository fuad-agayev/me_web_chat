import { getMessages } from '../services/message.service.js';
import { formatAudioUrl } from '../utils/audio.js'
// export const getChat = async (req, res) => {
//       const { userId } = req.params;
//       const messages = await getMessages(req.user.id, userId)
//       res.json(messages)
// } ]
//? ALready URL clodinary http fiel path

export const getChat = async (req, res) => {
  const { userId } = req.params;
  const messages = await getMessages(req.user.id, userId);

  const formatted = messages.map(m => ({
    ...m,
    audio_url: formatAudioUrl(m.audio_url)
  }));

  res.json(formatted);
};