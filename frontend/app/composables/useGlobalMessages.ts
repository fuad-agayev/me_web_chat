import { useAudioUpload } from "./useAudioUpload";

export const useGlobalAudioMessages = () => {
  const { uploadAudio } = useAudioUpload();
  
  
  const sendGlobalAudioMessage = async (file: File) => {
        return await uploadAudio(file, "/api/global/audio");
  
};


  return { sendGlobalAudioMessage };
};
