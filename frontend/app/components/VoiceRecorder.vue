<template>
  <div class="flex gap-2 items-center">
    <button @click="startRec" :disabled="isRecording">🎙️ Start</button>
    <button @click="stopRec" :disabled="!isRecording">⏹️ Stop</button>
    <span v-if="isRecording" class="text-red-500 text-xs ml-2 animate-pulse">Recording...</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAudioRecorder } from "~/composables/useAudioRecorder";

const props = defineProps<{ mode: "private" | "global" }>();

// emit tanımı
const emit = defineEmits<{
  (e: "stop", file: File, mode: "private" | "global"): void;
}>();

const { startRecording, stopRecording } = useAudioRecorder();
const isRecording = ref(false);

const startRec = async () => {
  await startRecording();
  isRecording.value = true;
};

const stopRec = async () => {
  const file = await stopRecording();
  isRecording.value = false;
  if (!file) return;
  emit("stop", file, props.mode); // faylı parent-ə ötür
};
</script>
