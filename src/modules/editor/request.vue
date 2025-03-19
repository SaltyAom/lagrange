<script setup lang="ts">
import { ref } from 'vue'

import { RadioGroupRoot } from 'radix-vue'

import Editor from './editor.vue'
import Chip from '../../components/chip.vue'

import { useEditorStore, useEditorInstance, editorTypes } from './store'

const editor = useEditorStore()
const editorInstance = useEditorInstance()

const type = ref<editorTypes[number]>(editorTypes[0])

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
</script>

<template>
	<RadioGroupRoot
		v-model="type"
		type="single"
		class="flex items-start text-xs pr-2"
	>
		<Chip
			v-for="item in editorTypes"
			:value="item"
			:active="type === item"
			:id="type === item ? 'request-toolbar' : undefined"
			up-element="url"
			:down-element="focusRequestEditor"
		>
			{{ item }}
		</Chip>
	</RadioGroupRoot>
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
