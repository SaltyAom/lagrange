<script setup lang="ts">
import { ref } from 'vue'

import {
	RadioGroupRoot,
	MenubarRoot,
	MenubarMenu,
	MenubarTrigger,
	MenubarPortal,
	MenubarContent,
	MenubarRadioGroup,
	MenubarRadioItem
} from 'reka-ui'

import Editor from './editor.vue'
import Chip from '../../components/chip.vue'

import { useEditorStore, useEditorInstance, editorTypes } from './store'
import { ChevronDownIcon } from 'lucide-vue-next'

const editor = useEditorStore()
const editorInstance = useEditorInstance()

const type = ref<editorTypes[number]>(editorTypes[0])
const menu = ref('')

const onInput = (value: string) => {
	editor.update({
		request: {
			[type.value]: value
		}
	})
}

const focusRequestEditor = () => {
	editorInstance.request?.focus()
}

const focusResponseEditor = () => {
	editorInstance.response?.focus()
}

const toolbar = () => {
	document.getElementById('request-toolbar')?.focus()
}

const types = editorTypes.filter((x) => x !== 'body')

const handleKey = (event: KeyboardEvent) => {
	if (event.key === 'Escape') {
		;(document.activeElement as HTMLInputElement)?.blur()
	}

	if (event.key === 'ArrowUp') {
		event.preventDefault()

		requestAnimationFrame(() => {
			type.value = 'body'
			return document.getElementById('url')?.focus()
		})
	}

	if (event.key === 'ArrowDown') {
		event.preventDefault()

		requestAnimationFrame(() => {
			focusRequestEditor()
			type.value = 'body'
		})
	}
}

const focusBody = () => {
	type.value = 'body'
}
</script>

<template>
	<MenubarRoot class="flex">
		<RadioGroupRoot
			v-model="type"
			type="single"
			class="flex items-start text-xs pr-2"
		>
			<MenubarMenu :value="type === 'body' ? 'request-toolbar' : ''">
				<MenubarTrigger
					class="relative flex items-center gap-1 text-slate-500 pl-1 pr-3.5 py-0.25 interact:bg-violet-500/10 interact:text-violet-500/90 rounded-full transition-all outline-none ring-0 cursor-pointer capitalize highlight-focus"
					@keydown="handleKey"
					@focus="focusBody"
					@click="focusBody"
					:class="{
						'bg-violet-500/10 text-violet-500/90 font-medium':
							type === 'body'
					}"
				>
					Body
					<ChevronDownIcon
						class="absolute right-0.25 transform"
						:size="12"
					/>
				</MenubarTrigger>
				<MenubarPortal>
					<MenubarContent
						class="text-xs p-0.5 min-w-[180px] bg-violet-50/75 backdrop-blur-lg rounded-lg outline-none border border-violet-500/25 transition-all"
						align="start"
						:side-offset="2"
						:align-offset="-2"
						style="
							box-shadow: 0 12px 48px
								color-mix(
									in oklab,
									var(--color-violet-500) 15%,
									transparent
								);
						"
					>
						<MenubarRadioGroup v-model="menu" class="flex flex-col gap-0.25">
							<MenubarRadioItem
								v-for="item in [
									'JSON',
									'formdata',
									'plaintext',
									'XML'
								]"
								:value="item"
								:aria-selected="item === menu"
								class="group relative flex items-center px-2 py-1 aria-selected:!bg-violet-500/10 data-[highlighted]:!bg-violet-500/10 aria-selected:text-violet-600 data-[highlighted]:text-violet-600 outline-none rounded-lg !cursor-pointer transition-all"
							>
								<div
									aria-hidden
									class="absolute left-0 w-0.75 h-0 group-aria-selected:h-3.5 group-data-[highlighted]:h-3.5 bg-violet-600 rounded transition-all"
								/>
								{{ item }}
							</MenubarRadioItem>
						</MenubarRadioGroup>
						<!-- <MenubarItem
							class="px-1.5 py-1 data-[highlighted]:!bg-violet-500/10 data-[highlighted]:text-violet-600 data-[highlighted]:font-medium outline-none rounded-lg !cursor-pointer transition-all"
						>
							formdata
						</MenubarItem>
						<MenubarItem
							class="px-1.5 py-1 data-[highlighted]:!bg-violet-500/10 data-[highlighted]:text-violet-600 data-[highlighted]:font-medium outline-none rounded-lg !cursor-pointer transition-all"
						>
							plaintext
						</MenubarItem>
						<MenubarItem
							class="px-1.5 py-1 data-[highlighted]:!bg-violet-500/10 data-[highlighted]:text-violet-600 data-[highlighted]:font-medium outline-none rounded-lg !cursor-pointer transition-all"
						>
							XML
						</MenubarItem> -->
					</MenubarContent>
				</MenubarPortal>
			</MenubarMenu>
			<!-- <Chip
				value="body"
				:active="type === 'body'"
				:id="type === 'body' ? 'request-toolbar' : undefined"
				up-element="url"
				:down-element="focusRequestEditor"
			>
				<label for="request-type">
					Type
					<select value="body" class="appearance-none outline-none">
						<option value="json">JSON</option>
						<option value="formdata">Form Data</option>
						<option value="plaintext">Plain Text</option>
						<option value="xml">XML</option>
					</select>
				</label>
			</Chip> -->
			<Chip
				v-for="item in types"
				:value="item"
				:active="type === item"
				:id="type === item ? 'request-toolbar' : undefined"
				up-element="url"
				:down-element="focusRequestEditor"
			>
				{{ item }}
			</Chip>
		</RadioGroupRoot>
	</MenubarRoot>
	<Editor
		name="request"
		:id="type + '-request'"
		:initial="editor.active.request[type]"
		:onInput="onInput"
		shortcut="e"
		shortcutMeta
		:up-element="toolbar"
		:right-element="focusResponseEditor"
	/>
</template>
