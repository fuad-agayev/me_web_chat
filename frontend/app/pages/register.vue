
<script setup lang="ts">
import { useAuth } from "~/composables/useAuth"
import { useToast } from "../composables/useToast"
import { ref, reactive } from "vue"

const { register } = useAuth()
const { success, error } = useToast()

const loading = ref(false)
const sent = ref(false)

const form = reactive({
  username: "",
  email: "",
  password: ""
})

const submit = async () => {
  loading.value = true

  try {
    await register(form)

    success("Verification email sent ✔")
    sent.value = true
  } catch (err: any) {
    error(err?.message || "Something went wrong")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container">

    <h1>Register</h1>

    <div v-if="!sent">
      <input v-model="form.username" placeholder="Username" />
      <input v-model="form.email" placeholder="Email" />
      <input v-model="form.password" placeholder="Password" />
<!--
       <div>
      <input
        :type="show ? 'text' : 'password'"
        v-model="form.password"
        placeholder="Password"
      />

      <button type="button" @click="show = !show">
        {{ show ? "🙈" : "👁" }}
      </button>
    </div>
  -->

      <button @click="submit" :disabled="loading">
        {{ loading ? "Loading..." : "Register" }}
      </button>
    </div>

    <div v-else>
      <h2>📩 Check your email</h2>
      <p>We sent you a verification link.</p>
    </div>

  </div>
</template>