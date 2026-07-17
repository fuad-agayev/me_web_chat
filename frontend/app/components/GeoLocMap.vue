
<template>
  <div
    id="map"
    class="w-full max-h-90 h-screen rounded-lg shadow-lg border border-white/20 bg-zinc-800 overflow-hidden mt-6"
  ></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, onBeforeUnmount } from "vue";

const { $leaflet } = useNuxtApp();

const props = defineProps<{ lat?: number; lng?: number }>();


let mapInstance: any = null;
let markerInstance: any = null;

const initMap = () => {
  const lat = props.lat ?? 40.4093;
  const lng = props.lng ?? 49.8671;


  if (mapInstance) {
    mapInstance.setView([lat, lng], 13);
    
    if (markerInstance) {
      markerInstance.setLatLng([lat, lng]);
    } else {
      markerInstance = $leaflet.marker([lat, lng]).addTo(mapInstance);
    }
    return;
  }

  // Harita ilk defa yükleniyorsa oluştur
  mapInstance = $leaflet.map("map").setView([lat, lng], 13);

  $leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(mapInstance);

  markerInstance = $leaflet.marker([lat, lng]).addTo(mapInstance);
};

onMounted(() => {
  initMap();
});

// Kullanıcı değiştiğinde ve yeni koordinatlar geldiğinde haritayı güncelle!
watch(
  () => [props.lat, props.lng],
  () => {
    initMap();
  }
);

// Komponent yok edildiğinde harita nesnesini temizle (Bellek sızıntısını önlemek için)
onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
    markerInstance = null;
  }
});
</script>


<!-- ?   plugins/leaflet.clinet.ts   yazmadikdan sonra bu scripti yazmaq lazimdir, cunki leaflet import olunmur. 
     ? Əgər plugin yaratmamısansa, onda komponentdə await import("leaflet") + import.meta.client yoxlaması ilə dinamik yükləyirsən. Bu halda $leaflet yoxdur, sadəcə L.map(...) istifadə edirsən.
<script setup lang="ts">
import { onMounted } from "vue";
//import L from "leaflet";
import "leaflet/dist/leaflet.css";

const props = defineProps<{ lat?: number; lng?: number }>();

onMounted(async () => {
  if (process.meta.client) {
    const L = await import("leaflet");   
    const lat = props.lat ?? 40.4093;
    const lng = props.lng ?? 49.8671;
    const map = L.map("map").setView([lat, lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([lat, lng]).addTo(map);
  }
});
</script>
-->

