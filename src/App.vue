<script setup lang="ts">
import { ref, watch } from 'vue'

import { getCurrentWindow } from '@tauri-apps/api/window'

import URL from './modules/editor/URL.vue'
import Request from './modules/editor/request.vue'
import Response from './modules/editor/response.vue'

import { Pin, Sidebar } from 'lucide-vue-next'
import { Toggle } from 'reka-ui'

import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'

import { useKeyDown } from './utils/keydown'

const isFocus = ref(false)
const isPinned = ref(false)

watch(isPinned, (value) => {
	const win = getCurrentWindow()

	win.setAlwaysOnTop(value)
})

useKeyDown((event) => {
	if (document.activeElement !== document.body) return

	if (
		event.metaKey &&
		(event.key === 'ArrowLeft' || event.key === 'ArrowRight')
	)
		document.getElementById('resize-handler')?.focus()
})
</script>

<template>
	<nav
		class="fixed z-30 top-0 flex justify-center items-start w-full h-9 text-xs font-medium select-none cursor-default"
		data-tauri-drag-region
	>
		<button
			class="absolute left-18.5 group flex justify-center items-center w-7 h-7 mt-1 rounded-lg text-slate-500 interact:bg-violet-500/10 transition-colors outline-none border border-transparent interact:border-violet-500/20 ring-0 cursor-pointer highlight-focus highlight-active"
			:class="{
				'!bg-violet-500/15 !border-violet-500/25': false
			}"
		>
			<Sidebar
				class="absolute transform p-0.5 group-interact:text-violet-500/90 transition-colors"
				:class="{ 'text-violet-500': false }"
				stroke-width="1.5"
			/>
		</button>
		<URL />
		<section class="absolute right-1 flex flex-row-reverse mt-1">
			<Toggle
				class="group flex justify-center items-center w-7 h-7 rounded-lg text-slate-500 interact:bg-violet-500/10 transition-colors outline-none border border-transparent interact:border-violet-500/20 ring-0 cursor-pointer highlight-focus highlight-active"
				v-model:pressed="isPinned"
				:class="{
					'!bg-violet-500/15 !border-violet-500/25': isPinned
				}"
			>
				<Pin
					class="absolute transform p-0.5 group-interact:text-violet-500/90 transition-colors"
					:class="{ 'text-violet-500': isPinned }"
					stroke-width="1.5"
				/>
			</Toggle>
		</section>
	</nav>
	<main class="relative flex w-full h-screen pt-7.5">
		<SplitterGroup direction="horizontal">
			<SplitterPanel
				class="relative flex flex-col h-[calc(100vh-2.25rem)] pt-1 pl-1 overflow-hidden"
				:style="{
					transition: isFocus ? 'flex 0.4s var(--ease-out-expo)' : ''
				}"
			>
				<Request />
			</SplitterPanel>
			<SplitterResizeHandle
				id="resize-handler"
				class="w-2 outline-none group px-0.5 pb-1.5 group"
				@focus="isFocus = true"
				@blur="isFocus = false"
			>
				<div
					class="w-full h-full group-focus:bg-violet-500/15 border border-transparent group-focus:border-violet-500/20 rounded-full transition-colors"
				/>
			</SplitterResizeHandle>
			<SplitterPanel
				class="flex flex-col h-[calc(100vh-2.25rem)] pt-1"
				:style="{
					transition: isFocus ? 'flex 0.4s var(--ease-out-expo)' : ''
				}"
			>
				<article class="relative flex flex-col w-full h-full">
					<Response />
				</article>
			</SplitterPanel>
		</SplitterGroup>
	</main>
</template>
