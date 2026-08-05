import { useAudioUpload } from "~/composables/useAudioUpload";

export const usePrivateMessages = (messages: any, user: any) => {
  const { uploadAudio } = useAudioUpload();
 

  const sendAudioMessage = async (file: File, receiverId: number) => {
    return await uploadAudio(file, "/api/messages/audio", receiverId);
  };

  return { sendAudioMessage };
};




