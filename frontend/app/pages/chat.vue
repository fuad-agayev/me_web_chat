
<script setup lang="ts">
import { onMounted, ref } from "vue";
import LeftSidebar from "~/components/LeftSidebar.vue";
import UserList from "~/components/UserList.vue";
import PrivateChat from "~/components/PrivateChat.vue";
import GlobalChat from "~/components/GlobalChat.vue";
import UserProfiles from "~/components/UserProfiles.vue";
import ChangePassword from "~/components/ChangePassword.vue"
import { LockClosedIcon, GlobeAltIcon, ArrowLeftOnRectangleIcon} from "@heroicons/vue/24/outline";
import { useChat } from "~/composables/useChat";
import { useAuth } from "~/composables/useAuth";
import { useGlobalChat } from "~/composables/useGlobalChat";

const { user, logout, fetchProfile,  updateLocation } = useAuth();
const { globalOnlineUsers, fetchGlobalOnlineUsers } = useGlobalChat();


const showLocationPopup = ref(false);
const showChangePassword = ref(false);

const toast = ref("");
const showToast = ref(false);
const errorMessage = ref("");


onMounted(async () => {
    if (user.value &&
        (user.value.latitude == null || user.value.longitude == null)) {
        showLocationPopup.value = true;
    }

    await fetchGlobalOnlineUsers();

     // Browser Notification icazəsi
    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }
});



const allowLocation = () => {
    // Popup hemen kapansın
    showLocationPopup.value = false;

    navigator.geolocation.getCurrentPosition(
        async (pos) => {

            try {
                await updateLocation(
                    pos.coords.latitude,
                    pos.coords.longitude
                );

                user.value!.latitude = pos.coords.latitude;
                user.value!.longitude = pos.coords.longitude;

                showSuccessToast("✅ Location updated successfully.");
            } catch (err) {
                console.error(err);
            }

        },
        (err) => {
            console.error(err);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
};

const { isUserTyping } = useChat();

const handleFile = async (e: any) => {
  const config = useRuntimeConfig();
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("avatar", file);

  await $fetch(`${config.public.apiBase}/api/users/avatar`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  await fetchProfile();
};

const showSuccessToast = (message: string) => {
  toast.value = message;
  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const openChangePassword = () => {
  errorMessage.value = ""; //? köhnə mesaj silinir Mantikti eger sabi deyilde bu dimakik ise

    if (user.value?.google_id) {
        errorMessage.value="Google accounts cannot change password.";

         setTimeout(() => {
            errorMessage.value = "";
        }, 3000);
        return;
    }

    showChangePassword.value = true;
}

definePageMeta({ middleware: "auth" });
const mode = ref<"private" | "global">("private");
const search = ref("");
const selectUser = ref<any>(null);
</script>

<template>
  <div class="flex flex-col md:flex-row h-auto md:h-screen text-white bg-zinc-800 overflow-hidden">
    <!-- Left Sidebar -->
    <LeftSidebar class="w-full md:w-64 lg:w-72" />

    <!-- Middle Section -->
    <div class="flex-1 flex flex-col md:flex-row h-auto md:h-[80vh] my-4 md:my-auto mx-2 md:mx-8 shadow-2xl shadow-[#9ca177] rounded-xl overflow-hidden">
      
      <!-- Sidebar -->
      <aside class="w-full md:w-72 flex flex-col overflow-hidden mx-0 md:mx-4 rounded-xl shadow-2xl shadow-black/70 bg-zinc-800">
        <!-- User Info + Search -->
        <div class="flex flex-col gap-4 p-4 shadow-md bg-zinc-900">
          <!-- User Info -->
          <div v-if="user" class="flex items-center gap-3 p-2 shadow-inner">
            <div class="relative group">
               <!-- img :src="user?.avatar" ? user?avatar : '/chat_app.png'   I CAN AMKE THIS VARIANT-->
              <img
                 :src="user?.avatar"
                
                alt="User avatar"
                class="w-12 h-12 rounded-full border-2 border-zinc-400 object-cover"
              />

              <label
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                       flex items-center justify-center rounded-full cursor-pointer transition"
              >
                📷
                <input type="file" hidden @change="handleFile" />
              </label>
            </div>
            <div class="flex-1">
              <h3 class="text-base font-semibold text-zinc-400 truncate">{{ user?.username }}</h3>
              <p class="text-xs text-zinc-300 truncate">{{ user?.email }}</p>
<div class="relative inline-block">
  <button
    @click="openChangePassword"
    :class="[
      'text-xs text-zinc-400 transition-colors',
      user?.google_id
        ? 'hover:text-[#b6805d]'
        : 'hover:text-[#d1d378]'
    ]"
  >
    <span class="flex items-center gap-1 font-bold">
      <LockClosedIcon class="w-4 h-4" />
      Change Password
    </span>
  </button>

  <Transition
    enter-active-class="transition duration-200"
    leave-active-class="transition duration-200"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="errorMessage"
      class="absolute top-full -left-16 px-4 rounded-md border border-[#d4cd88] py-2 text-xs text-slate-300 shadow-lg whitespace-nowrap z-50"
    >
      {{ errorMessage }}
    </div>
  </Transition>
</div>



            </div>

            <button @click="logout" class="flex items-center gap-1 px-2 py-1 rounded transition">
              <ArrowLeftOnRectangleIcon class="w-6 h-6 hover:scale-105 transition-transform" />
            </button>

            
            <!-- Modal component ayrı render edilir -->
           <ChangePassword v-if="showChangePassword" @close="showChangePassword = false" />

          </div>
          <!-- Search -->
          <input 
            v-model="search"
            type="text" 
            placeholder="Search ..." 
            class="w-full px-3 py-2 rounded bg-zinc-700 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#eee5d4]"
          />
        </div>

        <!-- Tabs -->
        <div class="flex shadow-md text-sm font-semibold py-4 px-2 gap-2">
          <!-- Private -->
          <button @click="mode='private'" 
            :class="mode==='private' ? 'flex-1 py-2 bg-linear-to-r from-[#64644e] to-zinc-400 text-white shadow-lg rounded' : 'flex-1 py-2 bg-zinc-700 text-zinc-100 rounded hover:bg-zinc-600'" 
            class="flex items-center justify-center space-x-2 transition-all">
            <LockClosedIcon class="w-5 h-5" />
            <span>Private</span>
          </button>
          <!-- Global -->
          <button @click="mode='global'" 
            :class="mode==='global' ? 'flex-1 py-2 bg-linear-to-r from-[#69694c] to-zinc-400 text-white shadow-lg rounded' : 'flex-1 py-2 bg-zinc-700 text-zinc-100 rounded hover:bg-zinc-600'" 
            class="flex items-center justify-center space-x-2 transition-all">
            <GlobeAltIcon class="w-5 h-5" />
            <span>Global</span>
          </button>
        </div>

        <!-- User List -->
        <div class="flex-1 overflow-y-auto p-4 shadow-inner">
          <UserList :mode="mode" @select="selectUser = $event" :search="search"/>
        </div>
      </aside>

      <!-- Chat Area -->
      <main class="flex-1 flex flex-col shadow-2xl shadow-[#9ca177] rounded-xl bg-zinc-800">
        <div class="flex-1 overflow-y-auto p-4 md:p-6">
          <PrivateChat v-if="mode==='private'" :selectedUser="selectUser"/>
          <GlobalChat v-else />
        </div>
      </main>


                <!-- Pop up lat long -->
                 <div
v-if="showLocationPopup"
class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

<div class="bg-zinc-800 rounded-xl p-8 w-25rem">
       <h2 class="text-xl font-bold"> Share your location? </h2>
       <p class="mt-4 text-zinc-300"> This helps nearby users find you.</p>
<div class="flex justify-end gap-4 mt-8">
<button @click="showLocationPopup=false">Skip </button>
<button @click="allowLocation"> Allow </button>
</div>
</div>
</div>

               <!--  PopUP  lat- long      -->

               <!--     Toast Location    -->
                    <Transition
  enter-active-class="transition duration-300"
  leave-active-class="transition duration-300"
  enter-from-class="opacity-0 translate-y-4"
  enter-to-class="opacity-100 translate-y-0"
  leave-from-class="opacity-100 translate-y-0"
  leave-to-class="opacity-0 translate-y-4"
>
  <div
    v-if="showToast"
    class="fixed bottom-6 right-6 bg-linear-to-r from-zinc-400 to-[#bebb87] text-zinc-700 px-5 py-3 rounded-xl shadow-2xl z-50"
  >
    {{ toast }}
  </div>
</Transition>
               <!--     Toast Location    -->

      <!-- Right Sidebar -->
      <aside class="w-full md:w-96 p-4 shadow-2xl shadow-[#ccd39b] rounded-xl bg-zinc-800 mt-4 md:mt-0 md:ml-4">
        <UserProfiles v-if="mode==='private'" :selectedUser="selectUser" />

        <div v-if="mode==='global'" class="text-zinc-300 p-6 rounded-2xl flex flex-col h-full">
          <GlobeAltIcon class="w-6 h-6 text-[#f5f0a6] mx-auto" />
          <div class="flex items-center justify-center gap-2 my-6">
            <h3 class="text-2xl font-semibold">Global Online Users</h3>
          </div>

          <p class="text-sm mb-3 mx-auto">Onlines:</p>
          <ul class="space-y-3 flex-1 overflow-y-auto my-6">
            <li v-for="u in globalOnlineUsers" :key="u.id" 
                class="flex items-center gap-3 p-3 rounded-md bg-zinc-700 shadow-md shadow-[#585a45] hover:shadow-lg transition">
              <img :src="u.avatar || '/chat_app.png'" 
                   alt="Global user avatar"
                   class="w-10 h-10 rounded-full border border-zinc-400 shadow-inner" />
              <span class="font-medium">{{ u.username }}</span>
            </li>
          </ul>

          <div class="h-1 bg-zinc-700 shadow-inner my-4 rounded"></div>

          <div class="text-sm text-gray-400">
            <p>Total online: {{ globalOnlineUsers.length }}</p>
            <p class="mt-1 italic">Stay connected with the community</p>
          </div>

          <div class="mt-auto pt-4 shadow-inner text-xs text-gray-500 flex justify-between">
            <span>Connected • {{ new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }}</span>
            <div class="flex gap-3">
              <button class="hover:text-red-400">⚙️ Settings</button>
              <button class="hover:text-red-400">❓ Help</button>
              <button class="hover:text-red-400">📜 Rules</button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>







