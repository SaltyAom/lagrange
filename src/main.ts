import { getCurrentWindow } from '@tauri-apps/api/window'
import { ViteSSG } from 'vite-ssg/single-page'

import App from './App.vue'
import { createPinia } from 'pinia'

export const createApp = ViteSSG(App, ({ app, initialState }) => {
	const pinia = createPinia()
	app.use(pinia)

	if (import.meta.env.SSR) initialState.pinia = pinia.state.value
	else pinia.state.value = initialState.pinia || {}
})

if (typeof window !== 'undefined')
	setTimeout(() => {
		getCurrentWindow().show()
	}, 0)
