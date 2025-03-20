import { onMounted, onUnmounted } from 'vue'

type KeyListener = (event: KeyboardEvent) => void

const listeners = <KeyListener[]>[]

export const useKeyDown = (listener: KeyListener, passive = true) => {
	if (!listeners.length) {
		onMounted(() => {
			window.addEventListener('keydown', handle, passive)
		})

		onUnmounted(() => {
			window.removeEventListener('keydown', handle, passive)
		})
	}

	listeners.push(listener)

	const handle = (event: KeyboardEvent) => {
		listeners.forEach((listener) => listener(event))
	}
}
