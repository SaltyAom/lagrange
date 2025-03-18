<script setup lang="ts">
import { ref, computed, useTemplateRef, onMounted, onUnmounted } from 'vue'
import { Command } from 'vue-command-palette'

import { Motion } from 'motion-v'

import { useEditorStore } from './store'

const editor = useEditorStore()

const url = computed({
	get() {
		return editor.active.url
	},
	set(value) {
		editor.active.url = value
	}
})

const method = computed({
	get() {
		return editor.active.method
	},
	set(value) {
		editor.active.method = value
	}
})

const isHover = ref(false)
const isFocus = ref(false)
const isActive = computed(() => isHover.value || isFocus.value)

const urlElement = useTemplateRef<HTMLInputElement | null>('url-element')
const methodElement = useTemplateRef<HTMLSelectElement>('method-element')
const ghostURL = useTemplateRef<HTMLElement>('ghost-url')

onMounted(() => {
	window.addEventListener('keydown', handleKey, true)
})

onUnmounted(() => {
	window.removeEventListener('keydown', handleKey, true)
})

const handleKey = (e: KeyboardEvent) => {
	if (e.metaKey && e.key === 'r') return void urlElement.value?.focus()

	if (document.activeElement === urlElement.value) {
		if (e.key === 'Escape' || (e.metaKey && e.key === 'Enter'))
			return void document.getElementById('url')!.blur()

		const element = e.target as HTMLInputElement
		const cursorPosition = element.selectionStart

		if (e.key === 'ArrowLeft' && cursorPosition === 0) {
			e.preventDefault()
			methodElement.value?.focus()
			return
		}

		if (e.key === 'ArrowRight' && cursorPosition === element.value.length) {
			e.preventDefault()
			document.getElementById('response-toolbar')?.focus()
			return
		}
	}

	if (document.activeElement === methodElement.value) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault()
			document.getElementById('request-toolbar')?.focus()
			return
		}

		if (e.key === 'ArrowRight') {
			e.preventDefault()
			urlElement.value?.focus()
		}
	}
}

const updateSuggestion = (newMethod: string, newUrl: string) => {
	if (editor.isFetching) return

	method.value = newMethod
	url.value = newUrl
}
</script>

<template>
	<p ref="ghost-url" class="absolute opacity-0">{{ url || 'URL' }}</p>
	<Motion
		tabindex="-1"
		as="div"
		class="relative w-fit max-w-[calc(100%-14rem)] sm:max-w-[calc(100%-20rem)] md:max-w-lg lg:max-w-2xl xl:max-w-4xl min-h-8 mt-0.5 border overflow-hidden outline-none"
		data-tauri-drag-region
		title="Use ⌘ + E to edit URL"
		@hover-start="isHover = true"
		@hover-end="isHover = false"
		style="
			will-change: width, background-color, border-color, box-shadow;
			border-radius: 0.625rem;
		"
		:style="{
			backdropFilter: isActive ? 'blur(4px)' : ''
		}"
		:initial="{
			scale: 1,
			y: '0%',
			width: ghostURL ? ghostURL.clientWidth + 2 + 'px' : 'auto',
			backgroundColor: 'rgba(255,255,255,0)',
			borderColor: 'rgba(0,0,0,0)',
			boxShadow: '0 1px 2px rgba(0,0,0,0)',
			backdropFilter: ''
		}"
		:animate="isActive ? 'hover' : 'initial'"
		:variants="{
			hover: {
				scale: 1.2,
				y: '10%',
				backgroundColor: 'rgba(255,255,255,.8)',
				borderColor: 'rgba(0,0,0,.1)',
				boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
				backdropFilter: 'blur(16px)'
			}
		}"
		:transition="{
			duration: 0.01,
			type: 'spring',
			stiffness: 324,
			damping: 18
		}"
	>
		<Command class="flex flex-col" theme="custom">
			<div class="flex items-center h-7 pr-3 mt-0.25 p-0.25">
				<select
					v-model="method"
					class="relative h-7 p-1.5 rounded-lg interact:bg-violet-500/10 border border-transparent interact:border-violet-500/15 transition-colors outline-none ring-0 cursor-pointer appearance-none font-mono"
					ref="method-element"
					@focus="isFocus = true"
					@blur="isFocus = false"
					:class="
						isActive
							? 'text-violet-800 font-semibold'
							: 'text-gray-500 interact:text-violet-500 font-normal'
					"
					:style="{
						width: `calc(${method.length}ch + (var(--spacing) * 1.5 * 2) + 2px)`
					}"
				>
					<option
						v-for="item in [
							'GET',
							'POST',
							'PUT',
							'PATCH',
							'DELETE',
							'HEAD',
							'CONNECT',
							'TRACE'
						]"
					>
						{{ item }}
					</option>
				</select>
				<input
					placeholder="URL"
					v-model="url"
					id="url"
					type="url"
					ref="url-element"
					:required="true"
					class="inline-flex appearance-none h-7 bg-transparent text-left outline-none ring-0 text-ellipsis transition-colors"
					:class="
						isActive
							? 'text-gray-800 font-normal'
							: 'text-gray-500 font-light'
					"
					style="will-change: width, color; padding-top: 1px"
					:style="{
						width: ghostURL
							? ghostURL.clientWidth + 2 + 'px'
							: undefined
					}"
					@focus="isFocus = true"
					@blur="isFocus = false"
					autocomplete="off"
					autocorrect="off"
					spellcheck="false"
				/>
			</div>

			<Motion
				tabindex="-1"
				as="div"
				:initial="{
					width: 0,
					height: 0,
					opacity: 0
				}"
				:animate="isActive ? 'hover' : 'initial'"
				:variants="{
					hover: {
						width: 'auto',
						height: 'auto',
						minWidth: '12rem',
						opacity: 1
					}
				}"
				:transition="{
					duration: 0.01,
					type: 'spring',
					stiffness: 324,
					damping: 26
				}"
				class="text-slate-500 px-0.25 max-h-[50vh] overflow-y-auto cursor-pointer overflow-hidden"
				style="will-change: width, height, opacity"
			>
				<Command.List>
					<Command.Item
						class="flex gap-1.5 aria-selected:text-violet-600 font-normal aria-selected:font-medium w-full first:mt-0.5 last:mb-0.25 px-1 py-0.75 aria-selected:bg-violet-500/10 rounded-lg border border-transparent aria-selected:border-violet-500/20 cursor-pointer"
						v-for="item in editor.active.history"
						:key="item.timestamp"
						:data-value="item.url"
						@select="() => updateSuggestion(item.method, item.url)"
					>
						<span class="pl-0.5 font-mono">
							{{ item.method }}
						</span>
						<span>
							{{ item.url }}
						</span>
					</Command.Item>
				</Command.List>
			</Motion>
		</Command>
	</Motion>
</template>
