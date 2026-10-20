import { onBeforeUnmount, ref } from 'vue'

export function useAppToast() {
  const message = ref('')
  let timer: number | undefined

  function show(nextMessage: string): void {
    message.value = nextMessage
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      message.value = ''
    }, 2600)
  }

  onBeforeUnmount(() => window.clearTimeout(timer))

  return { message, show }
}
