<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { useEditorStore, useEditorInstance } from './store'

import { RadioGroupRoot } from 'radix-vue'

import Editor from './editor.vue'
import Chip from '../../components/chip.vue'

const editor = useEditorStore()
const editorInstance = useEditorInstance()

const types = ['body', 'headers'] as const
const type = ref<(typeof types)[number]>(types[0])

const handleKey = (e: KeyboardEvent) => {
	if (e.metaKey && e.key === 'Enter') editor.fetch()
}

onMounted(() => {
	document.addEventListener('keydown', handleKey, true)
})

onUnmounted(() => {
	document.removeEventListener('keydown', handleKey, true)
})

const doc = computed(() => editor.active.response[type.value])

const focusRequestEditor = () => {
	editorInstance.request?.focus()
}

const focusResponseEditor = () => {
	editorInstance.response?.focus()
}

const focusToolbar = () => {
	document.getElementById('response-toolbar')?.focus()
}
</script>

<template>
	<header
		class="flex justify-between items-center gap-2 text-xs text-gray-500 pr-1"
	>
		<div class="flex gap-2">
			<h1 class="font-mono">
				{{ !editor.isFetching ? editor.active.response.status : '' }}
			</h1>
			<h2 class="font-mono">
				{{
					editor.active.response.ellapsed && !editor.isFetching
						? editor.active.response.ellapsed + 'ms'
						: ''
				}}
			</h2>
		</div>
		<RadioGroupRoot type="single" v-model="type" class="flex">
			<Chip
				v-for="item in types"
				:value="item"
				:active="type === item"
				:id="type === item ? 'response-toolbar' : undefined"
				up-element="url"
				:down-element="focusResponseEditor"
			>
				{{ item }}
			</Chip>
		</RadioGroupRoot>
	</header>
	<div
		class="absolute z-30 flex justify-center items-center w-full h-full"
		:class="editor.isFetching ? 'block' : 'hidden'"
	>
		<img class="w-36 pb-6" src="/gif/doro.gif" alt="doro" />
	</div>
	<div
		v-if="!editor.isFetching && !editor.active.response.ellapsed"
		class="absolute z-20 flex flex-col justify-center items-center w-full h-full pb-6"
	>
		<h1 class="text-2xl font-mono text-gray-500/50">Lagrange</h1>
	</div>
	<Editor
		name="response"
		readOnly
		:id="type + '-response'"
		:class="
			editor.isFetching || !editor.active.response.ellapsed
				? '!hidden'
				: ''
		"
		:doc="doc"
		shortcut="d"
		shortcutMeta
		:up-element="focusToolbar"
		:left-element="focusRequestEditor"
	/>
</template>
