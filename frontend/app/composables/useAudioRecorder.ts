export const useAudioRecorder = () => {
  let mediaRecorder: MediaRecorder | null = null;
  let chunks: BlobPart[] = [];

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    chunks = [];
    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.start();
  };

  const stopRecording = (): Promise<File | null> => {
    return new Promise(resolve => {
      if (!mediaRecorder) return resolve(null);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: "audio/webm" });
        resolve(file);
      };
      mediaRecorder.stop();
    });
  };

  return { startRecording, stopRecording };
};
