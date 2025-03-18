<script setup lang="ts">
import { ref } from 'vue'

import { RadioGroupRoot } from 'radix-vue'

import Editor from './editor.vue'
import Chip from '../../components/chip.vue'

import { useEditorStore, editorTypes } from './store'

const editor = useEditorStore()
const type = ref<editorTypes[number]>(editorTypes[0])

const onInput = (value: string) => {
	editor.update({
		request: {
			[type.value]: value
		}
	})
}
</script>

<template>
	<RadioGroupRoot
		v-model="type"
		type="single"
		class="flex items-start text-xs pr-2 overflow-hidden"
	>
		<Chip
			v-for="item in editorTypes"
			:value="item"
			:active="type === item"
			:id="type === item ? 'request-toolbar' : undefined"
		>
			{{ item }}
		</Chip>
	</RadioGroupRoot>
	<Editor
		:id="type + '-request'"
		:initial="editor.active.request[type]"
		:onInput="onInput"
		shortcut="e"
		shortcutMeta
		previousElement="request-toolbar"
	/>
</template>
