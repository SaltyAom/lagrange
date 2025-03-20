<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue'
import { useKeyDown } from '../../utils/keydown'

import { AnimatePresence, motion } from 'motion-v'
import { Command } from 'vue-command-palette'

import { useEditorStore, type EditorHistory } from './store'
import { storeToRefs } from 'pinia'

const editor = useEditorStore()
const activeEditor = storeToRefs(editor).active

const isHover = ref(false)
const isFocus = ref(false)
const isActive = computed(() => isHover.value || isFocus.value)

const urlElement = useTemplateRef<HTMLInputElement | null>('url-element')
const methodElement = useTemplateRef<HTMLSelectElement>('method-element')
const ghostURL = useTemplateRef<HTMLElement>('ghost-url')

useKeyDown((e) => {
	if (e.metaKey && e.key === 'r') return urlElement.value?.focus()

	const ignore = () => e.preventDefault

	const element = e.target as HTMLInputElement
	const cursorPosition = element.selectionStart

	switch (document.activeElement) {
		case urlElement.value:
			if (e.key === 'Escape' || (e.metaKey && e.key === 'Enter'))
				return urlElement.value?.blur()

			if (e.key === 'ArrowLeft' && cursorPosition === 0)
				return ignore() && methodElement.value?.focus()

			if (
				e.key === 'ArrowRight' &&
				cursorPosition === element.value.length
			)
				return (
					ignore() &&
					document.getElementById('response-toolbar')?.focus()
				)

			break

		case methodElement.value:
			if (e.key === 'Escape' || (e.metaKey && e.key === 'Enter'))
				return methodElement.value?.blur()

			if (e.key === 'ArrowLeft')
				return (
					ignore() &&
					document.getElementById('request-toolbar')?.focus()
				)

			if (e.key === 'ArrowRight')
				return ignore() && urlElement.value?.focus()

			break
	}
}, false)

const updateSuggestion = (method: string, url: string) => {
	if (editor.isFetching) return

	editor.update({
		method,
		url
	})
}

const suggestions = computed(() => {
	if (!activeEditor.value.url) return editor.active.history

	const suggestions = <EditorHistory[]>[]

	findUnique: for (const item of editor.active.history) {
		if (
			!item.url.includes(activeEditor.value.url) ||
			item.method !== activeEditor.value.method
		)
			continue

		for (const suggestion of suggestions)
			if (
				suggestion.url === item.url &&
				suggestion.method === item.method
			)
				continue findUnique

		suggestions.push(item)
	}

	return suggestions
})
</script>

<template>
	<p ref="ghost-url" class="absolute opacity-0">
		{{ activeEditor.url || 'URL' }}
	</p>
	<motion.aside
		tabindex="-1"
		id="dynamic-url"
		class="relative w-fit max-w-[calc(100%-14rem)] sm:max-w-[calc(100%-20rem)] md:max-w-lg lg:max-w-2xl xl:max-w-4xl min-h-7 mt-0.5 overflow-hidden outline-none"
		data-tauri-drag-region
		title="Use ⌘ + E to edit URL"
		@hover-start="isHover = true"
		@hover-end="isHover = false"
		style="
			border-radius: 0.625rem;
			will-change:
				top, width, background-color, box-shadow, transform,
				backdrop-filter;
		"
		:initial="{
			scale: 1,
			y: '0%',
			width: ghostURL ? ghostURL.clientWidth + 2 + 'px' : 'auto',
			backgroundColor:
				' color-mix(in oklab, var(--color-violet-100) 0%, transparent)',
			boxShadow:
				'0 1px 2px color-mix(in oklab, var(--color-violet-500) 0%, transparent), 0 0 0 0 color-mix(in oklab, var(--color-violet-500) 25%, transparent)',
			backdropFilter: ''
		}"
		:animate="isActive ? 'hover' : 'initial'"
		:variants="{
			hover: {
				scale: 1.2,
				y: '15%',
				backgroundColor:
					'color-mix(in oklab, var(--color-violet-200) 35%, transparent)',
				boxShadow:
					'0 12px 48px color-mix(in oklab, var(--color-violet-500) 25%, transparent), 0 0 0 1px color-mix(in oklab, var(--color-violet-500) 15%, transparent)',
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
			<div class="flex items-center h-7 pr-3 p-0.25">
				<select
					v-model="activeEditor.method"
					class="relative h-6 ml-0.25 pt-0.5 px-1.5 rounded-lg interact:bg-violet-500/10 transition-colors outline-none cursor-pointer border border-transparent interact:border-violet-500/50 appearance-none font-mono highlight-focus"
					ref="method-element"
					@focus="isFocus = true"
					@blur="isFocus = false"
					:class="
						isActive
							? 'text-violet-800 font-semibold'
							: 'text-gray-500 interact:text-violet-500 font-normal'
					"
					:style="{
						width: `calc(${activeEditor.method.length}ch + (var(--spacing) * 1.5 * 2) + 2px)`
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
					v-model="activeEditor.url"
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
							: '3.45ch'
					}"
					@focus="isFocus = true"
					@blur="isFocus = false"
					autocomplete="off"
					autocorrect="off"
					spellcheck="false"
				/>
			</div>

			<motion.div
				tabindex="-1"
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
					<AnimatePresence>
						<motion.div
							v-for="item in suggestions"
							:key="item.timestamp"
							:initial="{ height: 0, opacity: 0 }"
							:animate="{
								height: '1.5rem',
								opacity: 1
							}"
							:exit="{ height: 0, opacity: 0 }"
							class="flex items-center overflow-hidden cursor-pointer"
							:transition="{
								duration: 0.01,
								type: 'spring',
								stiffness: 400,
								damping: 22
							}"
							style="will-change: height, opacity"
						>
							<Command.Item
								class="flex gap-1.5 aria-selected:text-violet-600 font-normal aria-selected:font-medium w-full px-1 py-0.75 aria-selected:bg-violet-500/10 rounded-lg cursor-pointer overflow-hidden"
								:data-value="item.url"
								@select="
									() =>
										updateSuggestion(item.method, item.url)
								"
							>
								<span class="pl-0.5 font-mono">
									{{ item.method }}
								</span>
								<span>
									{{ item.url }}
								</span>
							</Command.Item>
						</motion.div>
					</AnimatePresence>
				</Command.List>
			</motion.div>
		</Command>
	</motion.aside>
</template>
