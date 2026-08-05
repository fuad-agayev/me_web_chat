import { useApi } from "~/composables/refreshApi";

export const useAudioUpload = () => {
  const { request } = useApi();

  const uploadAudio = async (file: File, endpoint: string, receiverId?:number) => {
    const fd = new FormData();
    fd.append("audio", file);
     if (receiverId) fd.append("receiverId", receiverId.toString());
    const res = await request(endpoint, { method: "POST", body: fd });
    return res; // içində audio_url olacaq
  };

  return { uploadAudio };
};

