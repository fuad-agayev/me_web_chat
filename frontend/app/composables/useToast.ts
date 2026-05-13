export const useToast = () => {
  const success = (msg: string) => {
    alert("✔ " + msg) // şimdilik basit
  }

  const error = (msg: string) => {
    alert("❌ " + msg)
  }

  return { success, error }
}